const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

/**
 * RAG Service: bridges Node.js API layer with Python ML service.
 *
 * Flow:
 *   1. Build enriched prompt context (farm state + session memory)
 *   2. POST to ML service /rag/chat
 *   3. ML service: embed query → FAISS search → build prompt → LLM → respond
 *   4. Return structured response + RAG metadata
 */

/**
 * Build a rich farm-context object from DB records to inject into the RAG prompt.
 */
function buildFarmContext(farm, latestSoilReading, user) {
  if (!farm) return null;
  return {
    farmId:       farm._id,
    landSize:     farm.landSize,
    irrigationType: farm.irrigationType,
    location: {
      lat:      farm.latitude,
      lng:      farm.longitude,
      district: user?.district,
      state:    user?.state,
    },
    soil: latestSoilReading ? {
      N:             latestSoilReading.N,
      P:             latestSoilReading.P,
      K:             latestSoilReading.K,
      pH:            latestSoilReading.pH,
      organicCarbon: latestSoilReading.organicCarbon,
      moisture:      latestSoilReading.moisture,
      healthScore:   latestSoilReading.healthScore,
      testDate:      latestSoilReading.readingDate,
    } : farm.currentSoilHealth,
    currentCrop: farm.croppingHistory?.slice(-1)[0]?.crop || null,
    croppingHistory: farm.croppingHistory?.slice(-4) || [],
  };
}

/**
 * Send a message to the RAG pipeline in the ML service.
 * Returns: { response, ragContext, tokensUsed, latencyMs }
 */
async function queryRAG({ userMessage, sessionId, sessionSummary, farmContext, language = 'en' }) {
  const t0 = Date.now();

  try {
    const payload = {
      message:        userMessage,
      session_id:     sessionId,
      session_summary: sessionSummary || '',
      farm_context:   farmContext || null,
      language,
    };

    const { data } = await axios.post(
      `${ML_SERVICE_URL}/rag/chat`,
      payload,
      { timeout: 30_000 }
    );

    return {
      response:   data.response,
      ragContext: data.rag_context || [],
      tokensUsed: data.tokens_used || 0,
      latencyMs:  Date.now() - t0,
      modelUsed:  data.model_used || 'unknown',
    };

  } catch (err) {
    console.error('RAG service error:', err.message);

    // Graceful fallback: rule-based response when ML service is down
    return {
      response: buildFallbackResponse(userMessage, farmContext),
      ragContext: [],
      tokensUsed: 0,
      latencyMs: Date.now() - t0,
      modelUsed: 'fallback',
    };
  }
}

/**
 * Request a rolling LLM summary of the session (called every 10 messages).
 * The summary is stored in ChatSession.summary for future context injection.
 */
async function summarizeSession(messages) {
  try {
    const transcript = messages
      .slice(-20)
      .map(m => `Farmer: ${m.userMessage}\nAI: ${m.aiResponse}`)
      .join('\n\n');

    const { data } = await axios.post(
      `${ML_SERVICE_URL}/rag/summarize`,
      { transcript },
      { timeout: 20_000 }
    );

    return data.summary || '';
  } catch {
    return '';
  }
}

/**
 * Rule-based fallback for when the ML service is unavailable.
 * Ensures farmers always get some useful response.
 */
function buildFallbackResponse(message, farmContext) {
  const msg = message.toLowerCase();

  if (msg.includes('weather') || msg.includes('rain') || msg.includes('forecast')) {
    return 'I\'m having trouble reaching the weather service right now. Please check the Weather tab for the latest forecast. If you notice rain in the next 2 days, hold off on pesticide applications.';
  }
  if (msg.includes('soil') || msg.includes('nutrient') || msg.includes('fertilizer')) {
    const ph = farmContext?.soil?.pH;
    if (ph) {
      return `Your soil pH is ${ph}. ${ph >= 6.0 && ph <= 7.5 ? 'This is within the ideal range for most crops.' : ph < 6.0 ? 'This is slightly acidic — consider liming to raise pH.' : 'This is slightly alkaline — sulfur amendments may help.'} For specific fertilizer recommendations, check the Soil Health tab.`;
    }
    return 'For accurate soil recommendations, please ensure your soil data is up to date in the Soil Health section. Key parameters to check: N, P, K levels and pH.';
  }
  if (msg.includes('crop') || msg.includes('grow') || msg.includes('plant') || msg.includes('recommend')) {
    return `Based on your farm profile, check the Crop Recommendations tab for AI-powered suggestions. The recommendations consider your soil type, current season, and historical cropping patterns.`;
  }
  if (msg.includes('pest') || msg.includes('disease') || msg.includes('insect')) {
    return 'For pest management: scout your fields early morning when insects are most active. If you see more than 5 aphids per leaf or signs of rust/blight, consider targeted application. Prefer bio-pesticides where possible to protect soil health.';
  }
  if (msg.includes('irrigation') || msg.includes('water')) {
    const moisture = farmContext?.soil?.moisture;
    if (moisture && moisture < 40) {
      return `Your soil moisture is at ${moisture}%, below the recommended 40–60% range. Consider irrigating within the next 24 hours. Apply 25–30mm if using flood irrigation.`;
    }
    return 'Soil moisture levels look acceptable. For drip systems, maintain 60–70% of field capacity. Avoid irrigation during peak afternoon heat to reduce evaporation loss.';
  }

  return 'I\'m currently operating in offline mode. For farm-specific advice, please check the Soil Health and Crop Recommendations tabs. Your data is safely stored locally and will sync when connectivity is restored.';
}

module.exports = { queryRAG, buildFarmContext, summarizeSession };
