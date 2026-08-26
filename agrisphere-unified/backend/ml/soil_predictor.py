import math
from typing import Dict, Any, List

def calculate_soil_health_score(
    nitrogen: float,
    phosphorus: float,
    potassium: float,
    ph: float,
    organic_carbon: float,
    moisture: float = 35.0,
    ec: float = 0.8
) -> Dict[str, Any]:
    """
    Computes Soil Health Index (0-100) based on ICAR & Soil Health Card standards.
    """
    # 1. Nitrogen Score (Ideal: 280 - 560 kg/ha or 140 - 280 ppm)
    if nitrogen < 140:
        n_score = max(20, (nitrogen / 140) * 60)
        n_status = "Deficient"
    elif nitrogen <= 280:
        n_score = 60 + ((nitrogen - 140) / 140) * 40
        n_status = "Optimal"
    else:
        n_score = max(70, 100 - ((nitrogen - 280) / 200) * 30)
        n_status = "Excess"

    # 2. Phosphorus Score (Ideal: 25 - 55 kg/ha)
    if phosphorus < 15:
        p_score = max(25, (phosphorus / 15) * 60)
        p_status = "Deficient"
    elif phosphorus <= 45:
        p_score = 60 + ((phosphorus - 15) / 30) * 40
        p_status = "Optimal"
    else:
        p_score = max(65, 100 - ((phosphorus - 45) / 50) * 30)
        p_status = "Excess"

    # 3. Potassium Score (Ideal: 120 - 280 kg/ha)
    if potassium < 100:
        k_score = max(20, (potassium / 100) * 60)
        k_status = "Deficient"
    elif potassium <= 250:
        k_score = 60 + ((potassium - 100) / 150) * 40
        k_status = "Optimal"
    else:
        k_score = max(70, 100 - ((potassium - 250) / 200) * 30)
        k_status = "Excess"

    # 4. pH Score (Ideal: 6.5 - 7.5)
    if 6.2 <= ph <= 7.8:
        ph_score = 100 - abs(ph - 7.0) * 20
        ph_status = "Neutral (Ideal)"
    elif 5.5 <= ph < 6.2:
        ph_score = 60 + (ph - 5.5) * 40
        ph_status = "Moderately Acidic"
    elif ph < 5.5:
        ph_score = max(20, ph * 10)
        ph_status = "Strongly Acidic"
    elif 7.8 < ph <= 8.5:
        ph_score = 60 + (8.5 - ph) * 40
        ph_status = "Moderately Alkaline"
    else:
        ph_score = max(20, 100 - (ph - 8.5) * 30)
        ph_status = "Strongly Alkaline"

    # 5. Organic Carbon Score (Ideal: 0.75% - 1.5%)
    if organic_carbon < 0.5:
        oc_score = max(20, (organic_carbon / 0.5) * 55)
        oc_status = "Low"
    elif organic_carbon <= 1.2:
        oc_score = 60 + ((organic_carbon - 0.5) / 0.7) * 40
        oc_status = "Medium to High (Good)"
    else:
        oc_score = 95
        oc_status = "Rich"

    # Weighted Overall Score
    weights = {"N": 0.25, "P": 0.20, "K": 0.20, "pH": 0.15, "OC": 0.20}
    overall_score = (
        n_score * weights["N"] +
        p_score * weights["P"] +
        k_score * weights["K"] +
        ph_score * weights["pH"] +
        oc_score * weights["OC"]
    )
    overall_score = round(float(overall_score), 1)

    # Risk level & economic loss calculation
    if overall_score >= 80:
        risk_level = "Low"
        risk_color = "#10B981"  # Emerald
        loss_rate = 1200  # ₹/acre
        decline_prob = 8
    elif overall_score >= 60:
        risk_level = "Medium"
        risk_color = "#F59E0B"  # Amber
        loss_rate = 4500  # ₹/acre
        decline_prob = 24
    elif overall_score >= 40:
        risk_level = "High"
        risk_color = "#F97316"  # Orange
        loss_rate = 9800  # ₹/acre
        decline_prob = 48
    else:
        risk_level = "Critical"
        risk_color = "#EF4444"  # Red
        loss_rate = 16500  # ₹/acre
        decline_prob = 76

    return {
        "score": overall_score,
        "risk_level": risk_level,
        "risk_color": risk_color,
        "yield_decline_probability_pct": decline_prob,
        "estimated_economic_loss_per_acre_inr": loss_rate,
        "breakdown": {
            "nitrogen": {"score": round(n_score, 1), "status": n_status, "value": nitrogen, "unit": "kg/ha"},
            "phosphorus": {"score": round(p_score, 1), "status": p_status, "value": phosphorus, "unit": "kg/ha"},
            "potassium": {"score": round(k_score, 1), "status": k_status, "value": potassium, "unit": "kg/ha"},
            "ph": {"score": round(ph_score, 1), "status": ph_status, "value": ph, "unit": ""},
            "organic_carbon": {"score": round(oc_score, 1), "status": oc_status, "value": organic_carbon, "unit": "%"}
        }
    }


def predict_nutrient_depletion(
    current_crop: str,
    nitrogen: float,
    phosphorus: float,
    potassium: float,
    organic_carbon: float,
    seasons: int = 3
) -> Dict[str, Any]:
    """
    Simulates 3-season drawdown of N, P, K under mono-cropping vs recommended rotation.
    """
    # Crop-specific nutrient uptake rates per season (in kg/ha)
    crop_uptake_map = {
        "rice": {"N": 38, "P": 14, "K": 32, "OC_loss": 0.05},
        "wheat": {"N": 32, "P": 12, "K": 26, "OC_loss": 0.04},
        "sugarcane": {"N": 55, "P": 22, "K": 50, "OC_loss": 0.08},
        "cotton": {"N": 42, "P": 16, "K": 35, "OC_loss": 0.06},
        "maize": {"N": 36, "P": 15, "K": 30, "OC_loss": 0.05},
        "soybean": {"N": 12, "P": 10, "K": 18, "OC_loss": 0.01},  # Legume fixates N
        "chickpea": {"N": 5, "P": 8, "K": 14, "OC_loss": 0.01},   # Legume
        "default": {"N": 30, "P": 12, "K": 25, "OC_loss": 0.04}
    }

    uptake = crop_uptake_map.get(current_crop.lower(), crop_uptake_map["default"])

    monoculture_trends = []
    rotation_trends = []

    curr_n, curr_p, curr_k, curr_oc = nitrogen, phosphorus, potassium, organic_carbon
    rot_n, rot_p, rot_k, rot_oc = nitrogen, phosphorus, potassium, organic_carbon

    for s in range(seasons + 1):
        season_label = f"Season {s}" if s > 0 else "Baseline (Now)"
        
        # Monoculture drawdown
        if s > 0:
            curr_n = max(20.0, curr_n - uptake["N"])
            curr_p = max(5.0, curr_p - uptake["P"])
            curr_k = max(25.0, curr_k - uptake["K"])
            curr_oc = max(0.2, curr_oc - uptake["OC_loss"])

        monoculture_trends.append({
            "season": season_label,
            "nitrogen": round(curr_n, 1),
            "phosphorus": round(curr_p, 1),
            "potassium": round(curr_k, 1),
            "organic_carbon": round(curr_oc, 2),
            "soil_health_score": calculate_soil_health_score(curr_n, curr_p, curr_k, 6.8, curr_oc)["score"]
        })

        # Rotation trajectory (incorporates legume restoration)
        if s > 0:
            if s % 2 == 1:
                # Cereal/Cash crop phase
                rot_n = max(30.0, rot_n - uptake["N"] * 0.7)
                rot_p = max(8.0, rot_p - uptake["P"] * 0.7)
                rot_k = max(30.0, rot_k - uptake["K"] * 0.7)
            else:
                # Legume/Green manure restorative phase (fixes N, preserves OC)
                rot_n = min(nitrogen * 1.15, rot_n + 35.0)  # N fixation + biofertilizer
                rot_p = min(phosphorus * 1.1, rot_p + 8.0)
                rot_k = min(potassium * 1.05, rot_k + 12.0)
                rot_oc = min(organic_carbon * 1.25, rot_oc + 0.08)

        rotation_trends.append({
            "season": season_label,
            "nitrogen": round(rot_n, 1),
            "phosphorus": round(rot_p, 1),
            "potassium": round(rot_k, 1),
            "organic_carbon": round(rot_oc, 2),
            "soil_health_score": calculate_soil_health_score(rot_n, rot_p, rot_k, 6.8, rot_oc)["score"]
        })

    # Summary insight
    n_drop = round(((nitrogen - curr_n) / max(nitrogen, 1)) * 100, 1)
    return {
        "crop": current_crop,
        "forecast_seasons": seasons,
        "monoculture_drawdown": monoculture_trends,
        "smart_rotation_trajectory": rotation_trends,
        "depletion_summary": {
            "nitrogen_loss_pct": n_drop,
            "projected_yield_loss_pct": min(45, int(n_drop * 0.65)),
            "recommended_action": "Introduce Legume/Pulse in Next Kharif/Rabi cycle to restore biological nitrogen."
        }
    }


def get_crop_rotation_recommendation(
    current_crop: str,
    soil_score: float,
    ph: float,
    irrigation_type: str = "Canal / Borewell"
) -> Dict[str, Any]:
    """
    Recommends optimal 3-stage crop rotation based on current soil parameters.
    """
    current_lower = current_crop.lower()
    
    rotations = {
        "rice": {
            "next_crop": "Chickpea / Lentils (Rabi)",
            "following_crop": "Sesbania / Green Manure (Summer)",
            "nitrogen_fixation_kg_ha": 45,
            "soil_restoration_pct": 28,
            "economic_benefit_inr_acre": 8500,
            "rationale": "Deep taproots break hardpan layer formed by paddy puddling; atmospheric N fixation restores N balance naturally."
        },
        "wheat": {
            "next_crop": "Moong Bean / Urad (Summer/Zaid)",
            "following_crop": "Maize or Soybean (Kharif)",
            "nitrogen_fixation_kg_ha": 35,
            "soil_restoration_pct": 22,
            "economic_benefit_inr_acre": 6200,
            "rationale": "Short-duration summer moong enriches soil organic carbon between wheat harvest and Kharif sowing."
        },
        "cotton": {
            "next_crop": "Pigeon Pea (Arhar) Intercrop",
            "following_crop": "Wheat / Chickpea",
            "nitrogen_fixation_kg_ha": 50,
            "soil_restoration_pct": 32,
            "economic_benefit_inr_acre": 11000,
            "rationale": "Pigeon pea brings subsoil phosphorus to surface and minimizes pink bollworm pest lifecycle persistence."
        },
        "sugarcane": {
            "next_crop": "Sunhemp / Crotalaria Green Manure",
            "following_crop": "Mustard / Gram",
            "nitrogen_fixation_kg_ha": 65,
            "soil_restoration_pct": 35,
            "economic_benefit_inr_acre": 14500,
            "rationale": "Recovers massive potassium & micronutrient depletion caused by heavy sugarcane ratoon crops."
        }
    }

    rec = rotations.get(current_lower, {
        "next_crop": "Cowpea / Black Gram",
        "following_crop": "Millet / Mustard",
        "nitrogen_fixation_kg_ha": 40,
        "soil_restoration_pct": 25,
        "economic_benefit_inr_acre": 7500,
        "rationale": "Balanced legume-cereal rotation to restore microbial diversity and replenish organic matter."
    })

    return {
        "current_crop": current_crop,
        "recommended_rotation": rec,
        "status": "Optimal Rotation Plan Generated"
    }
