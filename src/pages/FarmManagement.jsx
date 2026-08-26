import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const FarmManagement = () => {
  const { farms, selectedFarm, setSelectedFarm, refreshFarms, showToast, setActiveTab } = useApp();
  const { t } = useLanguage();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    farmer_name: '',
    location: '',
    land_size_acres: 5.0,
    soil_type: 'Alluvial Loam',
    irrigation_type: 'Tube Well / Borewell',
    current_crop: 'Wheat',
    nitrogen: 180,
    phosphorus: 35,
    potassium: 150,
    ph: 6.8,
    organic_carbon: 0.82
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createFarm(formData);
      showToast("Farm registered successfully with Soil Health Card!", "success");
      setShowAddForm(false);
      refreshFarms();
    } catch (err) {
      showToast("Failed to register farm: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (farmId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this farm profile?")) {
      try {
        await api.deleteFarm(farmId);
        showToast("Farm profile deleted.", "info");
        refreshFarms();
      } catch (err) {
        showToast("Failed to delete farm: " + err.message, "error");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#5D7052] text-xs font-bold uppercase tracking-wider mb-1.5">
            <MapPin className="w-4 h-4" />
            <span>Farm Profiles & Field Boundaries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C24] font-serif">
            {t('nav_farms')}
          </h1>
          <p className="text-xs sm:text-sm text-[#78786C] mt-1.5 font-medium">
            Manage your registered agricultural holdings, soil card histories, and active cropping seasons
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition-all self-start hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Register New Farm'}</span>
        </button>
      </div>

      {/* Add Farm Inline Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-8 rounded-[2.5rem] bg-[#FEFEFA] border border-[#5D7052]/40 shadow-float space-y-5">
          <h3 className="text-lg font-bold text-[#2C2C24] font-serif flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5D7052]" />
            <span>Add New Farm & Soil Baseline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Farm / Estate Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Shanti Agro Fields"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Farmer / Owner Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Kumar"
                value={formData.farmer_name}
                onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Location / District, State</label>
              <input
                type="text"
                required
                placeholder="e.g. Karnal, Haryana"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Land Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.land_size_acres}
                onChange={(e) => setFormData({ ...formData, land_size_acres: parseFloat(e.target.value) })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Current Standing Crop</label>
              <select
                value={formData.current_crop}
                onChange={(e) => setFormData({ ...formData, current_crop: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-bold text-[#2C2C24] cursor-pointer outline-none focus:ring-2 ring-[#5D7052]/30"
              >
                {["Wheat", "Rice", "Cotton", "Sugarcane", "Soybean", "Chickpea", "Maize", "Mustard"].map(c => (
                  <option key={c} value={c} className="bg-[#FEFEFA] text-[#2C2C24]">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Irrigation Facility</label>
              <select
                value={formData.irrigation_type}
                onChange={(e) => setFormData({ ...formData, irrigation_type: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-bold text-[#2C2C24] cursor-pointer outline-none focus:ring-2 ring-[#5D7052]/30"
              >
                <option value="Tube Well / Borewell" className="bg-[#FEFEFA] text-[#2C2C24]">Tube Well / Borewell</option>
                <option value="Canal Irrigation" className="bg-[#FEFEFA] text-[#2C2C24]">Canal Irrigation</option>
                <option value="Drip / Micro Irrigation" className="bg-[#FEFEFA] text-[#2C2C24]">Drip / Micro Irrigation</option>
                <option value="Rainfed (Monsoon Only)" className="bg-[#FEFEFA] text-[#2C2C24]">Rainfed (Monsoon Only)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 rounded-full bg-[#F0EBE5] text-xs font-bold text-[#78786C] hover:bg-[#E6DCCD] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition hover:scale-102 cursor-pointer"
            >
              {submitting ? 'Saving...' : 'Save & Link Farm'}
            </button>
          </div>
        </form>
      )}

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {farms.map((farm) => {
          const isSelected = selectedFarm?.id === farm.id;
          return (
            <div
              key={farm.id}
              onClick={() => setSelectedFarm(farm)}
              className={`p-7 rounded-[2.25rem] bg-[#FEFEFA] border transition-all cursor-pointer shadow-soft hover:-translate-y-1.5 hover:shadow-float ${
                isSelected
                  ? 'border-[#5D7052] ring-2 ring-[#5D7052]/20 bg-gradient-to-br from-[#FEFEFA] to-[#5D7052]/5'
                  : 'border-[#DED8CF] hover:border-[#5D7052]/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl font-bold text-[#2C2C24] font-serif">{farm.name}</h3>
                    {isSelected && (
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#5D7052]/15 text-[#5D7052] border border-[#5D7052]/30">
                        Active Field
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#78786C] flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C18C5D]" />
                    <span>{farm.location} • Farmer: {farm.farmer_name}</span>
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(farm.id, e)}
                  className="p-2.5 rounded-full text-[#78786C] hover:text-[#A85448] hover:bg-[#F0EBE5] transition cursor-pointer"
                  title="Remove Farm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3.5 my-5 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Land Size</span>
                  <span className="font-bold text-[#2C2C24] font-serif text-base mt-1 block">{farm.land_size_acres} Acres</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Current Crop</span>
                  <span className="font-bold text-[#5D7052] font-serif text-base mt-1 block">{farm.current_crop}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Soil Health</span>
                  <span className="font-bold text-[#C18C5D] font-serif text-base mt-1 block">
                    {farm.soil_health?.score || 78}/100
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#DED8CF]/60 text-xs text-[#78786C] font-medium">
                <span>Soil: {farm.soil_type}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFarm(farm);
                    setActiveTab('soil_precision');
                  }}
                  className="text-[#5D7052] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Simulate NPK →</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
