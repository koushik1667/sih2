import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Sparkles,
  Edit3,
  Check,
  AlertTriangle,
  RotateCcw,
  Layers,
  ArrowRight,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const FarmManagement = () => {
  const { 
    farms, 
    selectedFarm, 
    setSelectedFarm, 
    addFarm, 
    updateFarm, 
    deleteFarm, 
    showToast, 
    setActiveTab 
  } = useApp();
  const { t } = useLanguage();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [farmToDelete, setFarmToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialFormData = {
    name: '',
    farmer_name: '',
    location: '',
    land_size_acres: 5.0,
    soil_type: 'Alluvial Loam',
    irrigation_type: 'Tube Well / Borewell',
    current_crop: 'Wheat',
    active_season: 'Rabi 2026',
    nitrogen: 180,
    phosphorus: 35,
    potassium: 150,
    ph: 6.8,
    organic_carbon: 0.82
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.farmer_name.trim()) {
      showToast("Please fill in the required farm and farmer names.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await addFarm(formData);
      showToast("Farm registered successfully with Soil Health Card baseline!", "success");
      setFormData(initialFormData);
      setShowAddForm(false);
    } catch (err) {
      showToast("Failed to register farm: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingFarm) return;
    setSubmitting(true);
    try {
      await updateFarm(editingFarm.id, editingFarm);
      showToast("Farm profile updated successfully!", "success");
      setEditingFarm(null);
    } catch (err) {
      showToast("Failed to update farm: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!farmToDelete) return;
    try {
      await deleteFarm(farmToDelete.id);
      showToast(`Farm "${farmToDelete.name}" removed.`, "info");
      setFarmToDelete(null);
    } catch (err) {
      showToast("Failed to delete farm: " + err.message, "error");
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

        <div className="flex items-center gap-2.5 self-start">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (editingFarm) setEditingFarm(null);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showAddForm ? 'Close Form' : 'Register New Farm'}</span>
          </button>
        </div>
      </div>

      {/* Add Farm Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-8 rounded-[2.5rem] bg-[#FEFEFA] border-2 border-[#5D7052]/40 shadow-float space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
            <h3 className="text-lg font-bold text-[#2C2C24] font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5D7052]" />
              <span>Register New Farm & Soil Baseline</span>
            </h3>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Farm / Estate Name *</label>
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
              <label className="block text-[#2C2C24] font-bold mb-1.5">Farmer / Owner Name *</label>
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
              <label className="block text-[#2C2C24] font-bold mb-1.5">Location / District, State *</label>
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
                min="0.5"
                required
                value={formData.land_size_acres}
                onChange={(e) => setFormData({ ...formData, land_size_acres: parseFloat(e.target.value) || 1 })}
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

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Available Nitrogen (N kg/ha)</label>
              <input
                type="number"
                min="40"
                max="400"
                value={formData.nitrogen}
                onChange={(e) => setFormData({ ...formData, nitrogen: parseFloat(e.target.value) || 160 })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Phosphorus (P kg/ha)</label>
              <input
                type="number"
                min="5"
                max="80"
                value={formData.phosphorus}
                onChange={(e) => setFormData({ ...formData, phosphorus: parseFloat(e.target.value) || 30 })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Potassium (K kg/ha)</label>
              <input
                type="number"
                min="40"
                max="350"
                value={formData.potassium}
                onChange={(e) => setFormData({ ...formData, potassium: parseFloat(e.target.value) || 150 })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#5D7052]/30"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 rounded-full bg-[#F0EBE5] text-xs font-bold text-[#78786C] hover:bg-[#E6DCCD] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition hover:scale-102 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Save & Register Farm'}
            </button>
          </div>
        </form>
      )}

      {/* Edit Farm Modal */}
      {editingFarm && (
        <form onSubmit={handleEditSubmit} className="p-8 rounded-[2.5rem] bg-[#FEFEFA] border-2 border-[#C18C5D]/50 shadow-float space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
            <h3 className="text-lg font-bold text-[#2C2C24] font-serif flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#C18C5D]" />
              <span>Edit Farm Profile: {editingFarm.name}</span>
            </h3>
            <button 
              type="button" 
              onClick={() => setEditingFarm(null)}
              className="p-1 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Farm Name</label>
              <input
                type="text"
                required
                value={editingFarm.name}
                onChange={(e) => setEditingFarm({ ...editingFarm, name: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#C18C5D]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Farmer Name</label>
              <input
                type="text"
                required
                value={editingFarm.farmer_name}
                onChange={(e) => setEditingFarm({ ...editingFarm, farmer_name: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#C18C5D]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Location</label>
              <input
                type="text"
                required
                value={editingFarm.location}
                onChange={(e) => setEditingFarm({ ...editingFarm, location: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#C18C5D]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Land Size (Acres)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={editingFarm.land_size_acres}
                onChange={(e) => setEditingFarm({ ...editingFarm, land_size_acres: parseFloat(e.target.value) || 1 })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#C18C5D]/30"
              />
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Current Standing Crop</label>
              <select
                value={editingFarm.current_crop}
                onChange={(e) => setEditingFarm({ ...editingFarm, current_crop: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-bold text-[#2C2C24] cursor-pointer outline-none focus:ring-2 ring-[#C18C5D]/30"
              >
                {["Wheat", "Rice", "Cotton", "Sugarcane", "Soybean", "Chickpea", "Maize", "Mustard"].map(c => (
                  <option key={c} value={c} className="bg-[#FEFEFA] text-[#2C2C24]">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#2C2C24] font-bold mb-1.5">Soil Type</label>
              <input
                type="text"
                value={editingFarm.soil_type}
                onChange={(e) => setEditingFarm({ ...editingFarm, soil_type: e.target.value })}
                className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-medium text-[#2C2C24] outline-none focus:ring-2 ring-[#C18C5D]/30"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingFarm(null)}
              className="px-5 py-2.5 rounded-full bg-[#F0EBE5] text-xs font-bold text-[#78786C] hover:bg-[#E6DCCD] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-[#C18C5D] hover:bg-[#A9764A] text-white font-bold text-xs shadow-soft transition hover:scale-102 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Delete In-App Confirmation Dialog */}
      {farmToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/40 backdrop-blur-xs animate-fadeIn">
          <div className="p-7 max-w-md w-full rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-float space-y-4">
            <div className="flex items-center gap-3 text-[#A85448]">
              <div className="p-2.5 rounded-2xl bg-[#A85448]/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2C2C24] font-serif">Remove Farm Profile?</h3>
                <p className="text-xs text-[#78786C]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#2C2C24] leading-relaxed bg-[#F0EBE5]/50 p-3.5 rounded-2xl border border-[#DED8CF]">
              Are you sure you want to remove <span className="font-bold text-[#2C2C24]">"{farmToDelete.name}"</span> ({farmToDelete.location})? All associated soil baselines and telemetry will be unlinked.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFarmToDelete(null)}
                className="px-5 py-2.5 rounded-full bg-[#F0EBE5] text-xs font-bold text-[#78786C] hover:bg-[#E6DCCD] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-full bg-[#A85448] hover:bg-[#91453B] text-white text-xs font-bold shadow-soft transition hover:scale-102 cursor-pointer"
              >
                Yes, Delete Farm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State when no farms exist */}
      {farms.length === 0 && (
        <div className="p-12 text-center rounded-[2.5rem] bg-[#FEFEFA] border border-dashed border-[#DED8CF] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#2C2C24] font-serif">No Farm Profiles Registered</h3>
          <p className="text-xs text-[#78786C] max-w-md mx-auto">
            You haven't registered any farm parcels yet. Click below to register your agricultural field and initialize your real-time soil card data.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition cursor-pointer"
            >
              Add First Farm
            </button>
          </div>
        </div>
      )}

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {farms.map((farm) => {
          const isSelected = selectedFarm?.id === farm.id;
          return (
            <div
              key={farm.id}
              onClick={() => setSelectedFarm(farm)}
              className={`p-7 rounded-[2.25rem] bg-[#FEFEFA] border transition-all cursor-pointer shadow-soft hover:-translate-y-1 hover:shadow-float ${
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
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#5D7052]/15 text-[#5D7052] border border-[#5D7052]/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Active Field</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#78786C] flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#C18C5D]" />
                    <span>{farm.location} • Farmer: {farm.farmer_name}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setEditingFarm(farm);
                      setShowAddForm(false);
                    }}
                    className="p-2 rounded-full text-[#78786C] hover:text-[#C18C5D] hover:bg-[#F0EBE5] transition cursor-pointer"
                    title="Edit Farm Profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setFarmToDelete(farm)}
                    className="p-2 rounded-full text-[#78786C] hover:text-[#A85448] hover:bg-[#F0EBE5] transition cursor-pointer"
                    title="Delete Farm Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                <span>Soil: {farm.soil_type || 'Alluvial'}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFarm(farm);
                    setActiveTab('soil_precision');
                  }}
                  className="text-[#5D7052] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Simulate NPK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
