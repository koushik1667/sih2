"""
Agricultural Knowledge Base
────────────────────────────
Curated Q&A pairs and factual chunks covering:
  - Crop cultivation guides
  - Soil management
  - Pest & disease management
  - Irrigation best practices
  - Fertilizer recommendations
  - Climate impact

These are the documents that will be embedded and stored in FAISS.
In production, replace/augment with real PDF/database corpus.
"""

KNOWLEDGE_CHUNKS = [

    # ── Soil & Nutrients ─────────────────────────────────────────
    {
        "id": "soil_ph_001",
        "source": "soil_guide",
        "text": (
            "Soil pH is the most important factor in nutrient availability. "
            "Most crops thrive in a pH range of 6.0 to 7.5. Below pH 6.0 (acidic), "
            "phosphorus becomes locked and aluminum toxicity rises. Above pH 7.5 (alkaline), "
            "iron, manganese, and zinc become unavailable. To raise pH, apply agricultural lime "
            "at 2–3 tonnes/hectare. To lower pH, apply elemental sulfur at 200–500 kg/hectare."
        ),
        "tags": ["soil", "pH", "nutrients", "lime", "sulfur"],
    },
    {
        "id": "soil_nitrogen_001",
        "source": "soil_guide",
        "text": (
            "Nitrogen (N) is the primary driver of vegetative growth. Optimum range: 280–560 kg/ha. "
            "Signs of deficiency: yellowing of older leaves starting from the tip (chlorosis). "
            "Quick fix: apply urea (46-0-0) at 25–35 kg/acre as top-dressing after light rain. "
            "Avoid excess nitrogen as it promotes disease and delays maturity. "
            "Legumes like chickpea, soybean, and pigeonpea fix atmospheric N and should follow "
            "heavy feeders like wheat and maize in rotation."
        ),
        "tags": ["nitrogen", "fertilizer", "urea", "deficiency"],
    },
    {
        "id": "soil_organic_001",
        "source": "soil_guide",
        "text": (
            "Organic carbon (OC) above 0.75% indicates healthy microbial activity and good soil structure. "
            "Below 0.5% means poor water retention and nutrient-holding capacity. "
            "Improve OC by incorporating crop residue instead of burning, adding 3–5 tonnes/ha of FYM "
            "(farmyard manure), or growing a green manure crop (sunhemp, sesbania) before the main crop. "
            "Vermicompost at 2 t/ha improves OC within one season."
        ),
        "tags": ["organic_carbon", "soil_health", "manure", "composting"],
    },
    {
        "id": "soil_moisture_001",
        "source": "irrigation_guide",
        "text": (
            "Field capacity (FC) is the moisture level after excess water drains — typically 40–50% for loamy soil. "
            "Permanent wilting point (PWP) is around 20%. Irrigate when moisture drops below 40% of FC. "
            "Over-irrigation leads to waterlogging, root diseases, and nutrient leaching. "
            "Under-irrigation during critical growth stages (flowering, grain fill) causes significant yield loss. "
            "Install soil moisture sensors at 15 cm and 30 cm depth for precision irrigation management."
        ),
        "tags": ["irrigation", "moisture", "water_management", "field_capacity"],
    },

    # ── Wheat ────────────────────────────────────────────────────
    {
        "id": "wheat_cultivation_001",
        "source": "crop_guide_wheat",
        "text": (
            "Wheat (Triticum aestivum) is India's primary Rabi crop, sown October–December, harvested March–April. "
            "Optimal temperature: 10–25°C during growing season, cooler during grain filling. "
            "Requires 400–650 mm of water across the crop period (6–8 irrigations). "
            "Critical irrigation stages: crown root initiation (21 DAS), tillering (45 DAS), "
            "jointing (60 DAS), flowering (75 DAS), and grain filling (90 DAS). "
            "Never irrigate when crop is in flower — cold water shock reduces grain set. "
            "Recommended NPK: 120-60-40 kg/ha for irrigated conditions."
        ),
        "tags": ["wheat", "rabi", "irrigation", "NPK", "cultivation"],
    },
    {
        "id": "wheat_pests_001",
        "source": "pest_guide",
        "text": (
            "Key wheat pests in India: Aphids (Sitobion avenae) — suck sap, transmit BYDV virus. "
            "Threshold: 5–10 aphids per tiller warrants action. Apply imidacloprid 17.8% SL at 150 ml/ha. "
            "Yellow rust (Puccinia striiformis) — yellow stripes on leaves; spores spread by wind. "
            "Apply propiconazole 25% EC at 500 ml/ha at first sign. "
            "Armyworm — defoliates at night; use chlorpyrifos 20% EC at 2 L/ha. "
            "High humidity (>80%) + temperatures below 15°C create ideal conditions for rust — scout weekly."
        ),
        "tags": ["wheat", "pest", "aphid", "rust", "disease_management"],
    },

    # ── Soybean ──────────────────────────────────────────────────
    {
        "id": "soybean_cultivation_001",
        "source": "crop_guide_soybean",
        "text": (
            "Soybean is a self-pollinating legume grown in Kharif season (June–October). "
            "Optimum temperature: 20–30°C. Requires well-drained loamy soil with pH 6.0–7.0. "
            "Does not tolerate waterlogging — maintain furrow drainage. "
            "Being a legume, soybean fixes 40–80 kg N/ha through rhizobium symbiosis — "
            "seed treatment with Bradyrhizobium japonicum culture is strongly recommended. "
            "NPK requirement: 20-80-40 kg/ha (reduce N since it self-supplies via fixation). "
            "Pod fill stage (R5–R6) is the most water-sensitive — deficit causes yield loss of 30–60%."
        ),
        "tags": ["soybean", "kharif", "legume", "nitrogen_fixation", "NPK"],
    },

    # ── Chickpea ─────────────────────────────────────────────────
    {
        "id": "chickpea_cultivation_001",
        "source": "crop_guide_chickpea",
        "text": (
            "Chickpea (Bengal gram) is a drought-tolerant Rabi legume. "
            "Sowing: late October – November for desi type; November for kabuli type. "
            "Thrives in sandy loam to loam soils with pH 6.0–9.0. Does not need irrigation "
            "in many regions — one irrigation at pre-flowering (45–50 DAS) significantly improves yield. "
            "Being a legume, it fixes 25–40 kg N/ha — follow with high N-demand crops like wheat. "
            "Major pest: pod borer (Helicoverpa armigera) — use HaNPV biopesticide + pheromone traps. "
            "Fusarium wilt: use wilt-resistant varieties and seed treatment with Trichoderma viride."
        ),
        "tags": ["chickpea", "rabi", "drought_tolerant", "legume", "pod_borer"],
    },

    # ── Rice ─────────────────────────────────────────────────────
    {
        "id": "rice_cultivation_001",
        "source": "crop_guide_rice",
        "text": (
            "Rice cultivation: transplanted paddy requires 1200–2000 mm of water per season. "
            "Alternate Wetting and Drying (AWD) technique saves 30–40% water without yield loss: "
            "allow 3–5 days of no standing water, then flood again to 5 cm. "
            "Critical stages: tillering (15–40 DAT) and panicle initiation (55–60 DAT). "
            "Blast disease (Magnaporthe oryzae): avoid excess N, use tricyclazole 75% WP at 600 g/ha. "
            "Brown Plant Hopper (BPH): maintain bund vegetation as habitat for natural enemies (spiders). "
            "Direct Seeded Rice (DSR) reduces labor cost by 40% and water by 25%."
        ),
        "tags": ["rice", "kharif", "water_management", "AWD", "blast"],
    },

    # ── Irrigation & Water ────────────────────────────────────────
    {
        "id": "drip_irrigation_001",
        "source": "irrigation_guide",
        "text": (
            "Drip irrigation delivers water directly to the root zone at 1–4 L/hour per dripper. "
            "Efficiency: 85–95% compared to 40–50% for flood irrigation. "
            "Benefits: reduces weed pressure, prevents foliar diseases (dry leaves), "
            "enables fertigation (water-soluble fertilizers injected directly). "
            "Cost: ₹50,000–80,000/acre installed, with 50–60% subsidy under PMKSY scheme. "
            "Critical for drip: use drip-compatible soluble fertilizers — avoid clogging with "
            "well water by installing screen filters (120 mesh) and disk filters."
        ),
        "tags": ["drip_irrigation", "water_saving", "fertigation", "PMKSY"],
    },

    # ── Pest & Disease (general) ──────────────────────────────────
    {
        "id": "ipm_general_001",
        "source": "ipm_guide",
        "text": (
            "Integrated Pest Management (IPM): combine cultural, biological, and chemical control. "
            "1. Cultural: crop rotation, resistant varieties, timely sowing to escape peak pest pressure. "
            "2. Biological: release Trichogramma egg parasitoids for lepidopteran pests; "
            "   Chrysoperla (lacewing) for aphids and whitefly. "
            "3. Chemical: apply only when pest crosses Economic Threshold Level (ETL). "
            "   Use selective insecticides to preserve natural enemies. "
            "4. Pheromone traps: 1 trap per 0.5 ha for monitoring; 5+ moths/trap/day = spray threshold. "
            "Golden rule: never spray insecticides during 7–11 AM (bee foraging hours)."
        ),
        "tags": ["IPM", "pest_management", "biological_control", "pheromone"],
    },

    # ── Weather impact ────────────────────────────────────────────
    {
        "id": "weather_rain_impact_001",
        "source": "weather_agri",
        "text": (
            "Heavy rainfall (>40mm/day): avoid all field operations for 24–48 hours after rain. "
            "Do not apply fertilizers before predicted rain (>70% chance) — leaching loss. "
            "Fungicide wash-off: pesticides need 4–6 dry hours post-application to bind to leaf. "
            "If rain occurs within 2 hours of spray, re-apply after 3 dry days. "
            "Waterlogged crops: open drainage channels within 24 hours; root damage occurs after 48 hours. "
            "After flood recession: foliar urea spray (2%) revives stress-hit plants quickly."
        ),
        "tags": ["weather", "rain", "fertilizer", "pesticide", "waterlogging"],
    },
    {
        "id": "weather_drought_001",
        "source": "weather_agri",
        "text": (
            "Drought stress management: apply mulch (crop residue, plastic) to reduce soil evaporation by 40%. "
            "Anti-transpirants (kaolin clay 6% spray) reduce leaf water loss — effective in hot dry spells. "
            "Potassium (K) improves drought tolerance — apply MOP (muriate of potash) at flowering. "
            "Deficit irrigation: give priority water at flowering and grain filling — these are irreplaceable stages. "
            "Drought-tolerant varieties: MACS 6222 (wheat), NRC 37 (soybean), JAKI 9218 (chickpea). "
            "For extreme drought (no rain for >21 days), consider life-saving irrigation even from tanker."
        ),
        "tags": ["drought", "water_stress", "mulch", "potassium", "stress_management"],
    },

    # ── Market & Economics ────────────────────────────────────────
    {
        "id": "msp_2024_001",
        "source": "market_data",
        "text": (
            "Minimum Support Prices (MSP) for major crops — Rabi 2024-25: "
            "Wheat: ₹2,275/quintal. Chickpea (Chana): ₹5,440/quintal. Mustard: ₹5,650/quintal. "
            "Kharif 2024: Paddy (common): ₹2,300/quintal. Soybean (yellow): ₹4,892/quintal. "
            "Maize: ₹2,225/quintal. Groundnut: ₹6,783/quintal. "
            "Register at PM-KISAN portal and APMC e-NAM for direct market access and MSP protection. "
            "Soil Health Card (SHC) holders receive ₹300/ha input subsidy for following SHC recommendations."
        ),
        "tags": ["MSP", "market", "price", "government_scheme", "PM_KISAN"],
    },
]

def get_all_chunks():
    """Return all knowledge chunks as a list of dicts."""
    return KNOWLEDGE_CHUNKS

def get_chunk_texts():
    """Return list of plain text strings for embedding."""
    return [c["text"] for c in KNOWLEDGE_CHUNKS]

def get_chunk_ids():
    return [c["id"] for c in KNOWLEDGE_CHUNKS]
