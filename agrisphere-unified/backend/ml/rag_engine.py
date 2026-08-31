import re
from typing import Dict, Any, List

# Core agricultural knowledge base
AGRI_KNOWLEDGE = [
    {
        "keywords": ["nitrogen", "urea", "yellow", "chlorosis", "npk", "fertilizer", "pale"],
        "topic": "Nitrogen Management & Leaf Chlorosis",
        "content": "Nitrogen deficiency causes uniform yellowing (chlorosis) of older lower leaves first while upper leaves remain pale green. Remedy: Apply split dose of Neem-Coated Urea (40 kg/acre) or spray 2% Urea solution (20g/L water) or nano-urea at 4ml/L for rapid foliage absorption. For organic remedy, apply vermicompost @ 2 tons/acre or poultry manure.",
        "crop_relevance": "Rice, Wheat, Maize, Sugarcane",
        "citation": "ICAR Central Soil Salinity Research Institute Bulletin #42"
    },
    {
        "keywords": ["phosphorus", "root", "purple", "dap", "ssp", "bronze"],
        "topic": "Phosphorus Dosing & Root Development",
        "content": "Phosphorus deficiency leads to purplish or dark bronze discoloration on leaf undersides, stunted root development, and delayed flowering. Remedy: Basal application of Single Super Phosphate (SSP @ 50 kg/acre) or DAP (25 kg/acre) placed 5cm below seed depth. In acidic soils (pH < 6.0), use Rock Phosphate with PSB (Phosphate Solubilizing Bacteria).",
        "crop_relevance": "Cotton, Groundnut, Pulses, Wheat",
        "citation": "National Project on Organic Farming & Fertilizer Guidelines"
    },
    {
        "keywords": ["potassium", "potash", "mop", "scorch", "lodging", "burn"],
        "topic": "Potassium Nutrition & Stalk Strength",
        "content": "Potassium deficiency causes burning/scorching along leaf tips and outer margins, weak stems prone to lodging, and higher pest vulnerability. Remedy: Apply Muriate of Potash (MOP @ 20-30 kg/acre) at panicle initiation/tillering, or foliar spray of Potassium Nitrate (13-0-45 @ 10g/L).",
        "crop_relevance": "Sugarcane, Banana, Rice, Potato",
        "citation": "Potash Research Institute of India"
    },
    {
        "keywords": ["pest", "disease", "bollworm", "stem borer", "blast", "rust", "fungus", "insect"],
        "topic": "Integrated Pest & Disease Management (IPM)",
        "content": "For Stem Borer in Rice: Install Pheromone traps @ 5/acre, release Trichogramma egg parasitoids @ 20,000/acre. For Pink Bollworm in Cotton: Spray Emamectin Benzoate 5% SG @ 0.5g/L. For Wheat Yellow Rust: Spray Propiconazole 25% EC (Tilt @ 1ml/L) at first symptom. For Fungal Blast: Apply Tricyclazole 75% WP @ 0.6g/L.",
        "crop_relevance": "Rice, Cotton, Wheat, Mustard",
        "citation": "Directorate of Plant Protection, Quarantine & Storage (DPPQS)"
    },
    {
        "keywords": ["pm-kisan", "pmfby", "scheme", "subsidy", "insurance", "soil health card", "government", "kisan"],
        "topic": "Government Schemes & Farmer Financial Support",
        "content": "1. PM-KISAN: Direct income support of ₹6,000/year in 3 equal installments of ₹2,000 to all landholding farmers. 2. PMFBY (Crop Insurance): Premium rate 2% for Kharif, 1.5% for Rabi, 5% for commercial/horticultural crops covering post-harvest and prevented sowing losses. 3. Soil Health Card Scheme: Free 12-parameter soil testing with tailored fertilizer recommendations provided every 2 years by State Dept of Agriculture.",
        "crop_relevance": "All Crops",
        "citation": "Ministry of Agriculture & Farmers Welfare, Govt of India"
    },
    {
        "keywords": ["water", "irrigation", "drip", "sprinkler", "drought", "moisture", "dry"],
        "topic": "Precision Irrigation & Water Conservation",
        "content": "Under water stress or dry spells: 1. Adopt Drip/Micro-irrigation under PMKSY (Per Drop More Crop - 55% subsidy for small/marginal farmers). 2. Apply straw/crop residue mulch (5-7 cm layer) to reduce soil evaporation by 35-40%. 3. Spray Anti-transpirant (Kaolin clay 5% or Potassium Silicate 2ml/L) to minimize heat stress stomatal water loss.",
        "crop_relevance": "Cotton, Sugarcane, Vegetables, Maize",
        "citation": "Central Ground Water Board & ICAR Agronomy"
    },
    {
        "keywords": ["tomato", "transplanting", "planting", "panting", "seedling", "pre-planting", "pesticide", "fungicide", "nematode", "damping"],
        "topic": "Tomato Pre-Planting & Seedling Protection (ICAR Guidelines)",
        "content": "For Tomato plants before transplanting/planting:\n1. Seedling Root Dip (Prophylactic): Dip seedling roots for 15-20 minutes in Trichoderma viride (10g/L) or Carbendazim 50% WP (1g/L) to prevent Damping-Off and Fusarium Wilt.\n2. Sucking Pest & Early Whitefly/Thrips Shield: Mix Imidacloprid 17.8% SL @ 0.5 ml/L in the root dip solution to protect seedlings for 20-25 days after transplanting against Leaf Curl Virus vectors.\n3. Soil Application: Apply Neem Cake @ 100 kg/acre + Trichoderma harzianum @ 2 kg mixed in 500 kg FYM during final field preparation to suppress root-knot nematodes (Meloidogyne spp.) and soil-borne grubs/cutworms.",
        "crop_relevance": "Tomato, Chilli, Brinjal, Capsicum",
        "citation": "ICAR-IIHR Bangalore Tomato Production & IPM Package of Practices"
    },
    {
        "keywords": ["which crop", "crop selection", "best crop", "what to grow", "suggest crop", "profitable crop"],
        "topic": "Crop Selection & Agro-Climatic Planning",
        "content": "Crop selection depends on the season and your soil matrix:\n• Kharif (Monsoon - Jun to Oct): Paddy (Rice), Cotton, Soybean, Maize, Groundnut, Pigeonpea (Arhar).\n• Rabi (Winter - Nov to Apr): Wheat, Mustard, Chickpea (Chana), Barley, Potato, Tomato.\n• Zaid (Summer - Mar to Jun): Green gram (Moong), Black gram (Urad), Watermelon, Cucumber, Fodder Cowpea.\nFor maximum profitability and soil restoration: Alternate heavy nutrient-feeding crops (Paddy/Wheat) with restorative legumes (Chickpea/Moong) to naturally fix 40-60 kg atmospheric nitrogen per hectare.",
        "crop_relevance": "All Agro-Climatic Zones",
        "citation": "ICAR Central Agricultural Planning & Package of Practices"
    },
    {
        "keywords": ["ph", "salinity", "alkaline", "acidic", "lime", "gypsum", "alkali"],
        "topic": "Soil Reclamation: Acidity & Salinity Correction",
        "content": "For Acidic Soils (pH < 6.0): Broadcast Agricultural Lime (CaCO3) @ 500-1000 kg/acre 3 weeks before sowing. For Alkaline/Sodic Soils (pH > 8.5): Apply Agricultural Gypsum (CaSO4.2H2O @ 1.5-2.5 tons/acre) followed by ponding and leaching with fresh water. Grow salt-tolerant varieties like CSR-30 (Rice) or KRL-210 (Wheat).",
        "crop_relevance": "Rice, Wheat, Mustard, Pulses",
        "citation": "ICAR-CSSRI Karnal Soil Reclamation Manual"
    }
]

def search_knowledge_base(query: str) -> List[Dict[str, Any]]:
    q_lower = query.lower()
    tokens = set(re.findall(r'\w+', q_lower))
    matches = []
    for item in AGRI_KNOWLEDGE:
        score = 0
        for kw in item["keywords"]:
            if kw in q_lower or kw in tokens:
                score += 3
        if score > 0:
            matches.append((score, item))
    
    matches.sort(key=lambda x: x[0], reverse=True)
    return [m[1] for m in matches[:3]]


def generate_rag_response(
    query: str,
    language: str = "en",
    farm_context: Dict[str, Any] = None
) -> Dict[str, Any]:
    """
    RAG engine: Retrieves domain knowledge and formats actionable agronomist response.
    """
    results = search_knowledge_base(query)
    
    if not results:
        advice = "For your specific agricultural query, maintain optimal soil organic matter through regular addition of FYM/compost, follow balanced NPK fertilization (4:2:1 ratio for cereals), and ensure timely prophylactic pest scouting. Check with your local Krishi Vigyan Kendra (KVK) for regional advisories."
        citation = "ICAR General Agronomy Handbook"
        topic = "General Agronomy Practice"
    else:
        top_match = results[0]
        advice = top_match["content"]
        citation = top_match["citation"]
        topic = top_match["topic"]

    context_note = ""
    if farm_context and farm_context.get("crop"):
        context_note = f" (Tailored for {farm_context.get('crop')} on {farm_context.get('land_size', 2)} acres with {farm_context.get('soil_type', 'Alluvial/Black')} soil)"

    full_text = f"{advice}{context_note}"

    suggested_actions = [
        "Schedule soil NPK health re-test",
        "Check 7-day rainfall forecast before spraying",
        "Apply recommended bio-fertilizer split dose",
        "Explore PMKSY micro-irrigation subsidy"
    ]

    # Translate response fields if requested language is not English
    if language and language.lower() != "en":
        try:
            from ml.translator import translator_engine
            full_text = translator_engine.translate_text(full_text, from_code="en", to_code=language)
            topic = translator_engine.translate_text(topic, from_code="en", to_code=language)
            suggested_actions = [
                translator_engine.translate_text(act, from_code="en", to_code=language)
                for act in suggested_actions
            ]
        except Exception as e:
            pass

    return {
        "query": query,
        "language": language,
        "topic": topic,
        "answer": full_text,
        "citation": citation,
        "suggested_actions": suggested_actions,
        "sources_used": len(results)
    }

