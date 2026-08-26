import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Leaf, 
  Calendar, 
  Database, 
  ShieldCheck, 
  LogOut, 
  Edit2, 
  Check, 
  Save, 
  Layers, 
  Sprout,
  Trash2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, userProfile, logout, updateUserData } = useAuth();
  const { farms, showToast } = useApp();
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [stateName, setStateName] = useState(userProfile?.state || 'Punjab');
  const [preferredCrop, setPreferredCrop] = useState(userProfile?.preferredCrop || 'Wheat');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserData({
        displayName,
        phone,
        state: stateName,
        preferredCrop
      });
      setIsEditing(false);
      showToast("Profile details updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    showToast("Signed out of AgriSphere AI.", "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2C2C24]/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-[#FEFEFA] border border-[#DED8CF] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 sm:p-8 pb-4 border-b border-[#DED8CF]/60 bg-[#F0EBE5]/40 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-[#5D7052] text-[#FEFEFA] flex items-center justify-center font-bold text-lg shadow-soft font-serif overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                (userProfile?.displayName || user.displayName || user.email || 'F').charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#2C2C24] font-serif">
                  {userProfile?.displayName || user.displayName || 'Farmer Profile'}
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                  Cloud Synced
                </span>
              </div>
              <p className="text-xs text-[#78786C] font-mono mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0EBE5] hover:bg-[#DED8CF] text-[#78786C] hover:text-[#2C2C24] flex items-center justify-center transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* User Cloud Database Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-center">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">User Farms</span>
              <span className="text-xl font-bold font-serif text-[#5D7052] mt-1 block">{farms.length}</span>
              <span className="text-[9px] text-[#78786C] block">Isolated Cloud DB</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-center">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Total Land</span>
              <span className="text-xl font-bold font-serif text-[#C18C5D] mt-1 block">
                {farms.reduce((acc, f) => acc + (parseFloat(f.land_size_acres) || 0), 0).toFixed(1)} Ac
              </span>
              <span className="text-[9px] text-[#78786C] block">Cultivated</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-center">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Security</span>
              <span className="text-xl font-bold font-serif text-[#5D7052] mt-1 block flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#5D7052]" />
                <span>RBAC</span>
              </span>
              <span className="text-[9px] text-[#78786C] block">UID Guarded</span>
            </div>
          </div>

          {/* Farmer Details / Edit Form */}
          <div className="p-5 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                <User className="w-4 h-4 text-[#5D7052]" />
                <span>Farmer Profile & Regional Preferences</span>
              </h3>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-xs font-bold text-[#5D7052] hover:underline"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs font-bold text-[#78786C] hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#5D7052] text-[#FEFEFA] text-xs font-bold shadow-soft"
                  >
                    <Save className="w-3 h-3" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#78786C] uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] outline-none focus:border-[#5D7052]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#78786C] uppercase mb-1">State / Province</label>
                    <select
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] outline-none"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#78786C] uppercase mb-1">Primary Crop</label>
                    <select
                      value={preferredCrop}
                      onChange={(e) => setPreferredCrop(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] outline-none"
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Sugarcane">Sugarcane</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Maize">Maize</option>
                      <option value="Soybean">Soybean</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#78786C] uppercase mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] outline-none focus:border-[#5D7052]"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-[#F0EBE5]/30">
                  <span className="text-[10px] text-[#78786C] block font-semibold">Location State</span>
                  <span className="font-bold text-[#2C2C24]">{userProfile?.state || 'Punjab'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F0EBE5]/30">
                  <span className="text-[10px] text-[#78786C] block font-semibold">Primary Crop</span>
                  <span className="font-bold text-[#2C2C24]">{userProfile?.preferredCrop || 'Wheat'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F0EBE5]/30">
                  <span className="text-[10px] text-[#78786C] block font-semibold">Phone</span>
                  <span className="font-bold text-[#2C2C24]">{userProfile?.phone || 'Not configured'}</span>
                </div>
              </div>
            )}
          </div>

          {/* User Cloud Database Management */}
          <div className="p-5 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#5D7052]" />
              <h3 className="text-sm font-bold text-[#2C2C24] font-serif">Cloud Database Architecture</h3>
            </div>
            <p className="text-xs text-[#78786C] leading-relaxed">
              Your registered farm records, custom plots, soil test histories, and satellite super-resolution analyses are stored and isolated under <code className="bg-[#F0EBE5] px-1 py-0.5 rounded text-[11px] font-mono text-[#5D7052]">/users/{user.uid}</code> in Firestore.
            </p>
          </div>

          {/* Sign Out Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 rounded-full bg-[#A85448]/10 hover:bg-[#A85448]/20 text-[#A85448] font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-[#A85448]/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of AgriSphere AI</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
