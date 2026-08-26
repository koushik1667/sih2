import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  Sparkles, 
  Layers, 
  Upload, 
  Cpu, 
  Eye, 
  Activity, 
  Flame, 
  ShieldAlert, 
  Sprout 
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { ImageSlider } from '../components/ImageSlider';

export const SatelliteSRM = () => {
  const { t } = useLanguage();
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('punjab_wheat_belt');
  const [selectedModel, setSelectedModel] = useState('edsr');
  const [scaleFactor, setScaleFactor] = useState(4);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [inferenceResult, setInferenceResult] = useState(null);
  const [activeLayer, setActiveLayer] = useState('rgb'); // rgb, ndvi, false_color_nir, uncertainty
  const [error, setError] = useState(null);

  // Load presets on mount
  useEffect(() => {
    async function loadPresets() {
      try {
        const data = await api.getGeoPresets();
        if (data && data.presets) {
          setPresets(data.presets);
        }
      } catch (err) {
        console.error("Failed to load presets:", err);
      }
    }
    loadPresets();
    // Run default inference on first preset
    runInference('punjab_wheat_belt', 'edsr', 4);
  }, []);

  const runInference = async (presetId = selectedPreset, model = selectedModel, scale = scaleFactor) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (uploadedFile) {
        formData.append('file', uploadedFile);
      } else if (presetId) {
        formData.append('preset_id', presetId);
      }
      formData.append('model', model);
      formData.append('scale_factor', scale);

      const res = await api.runGeoSR(formData);
      if (res && res.data) {
        setInferenceResult(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to execute super-resolution inference.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setSelectedPreset(null);
      const reader = new FileReader();
      reader.onload = () => setUploadPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getActiveLayerImage = () => {
    if (!inferenceResult || !inferenceResult.images) return null;
    switch (activeLayer) {
      case 'ndvi':
        return inferenceResult.images.ndvi;
      case 'nir':
        return inferenceResult.images.false_color_nir;
      case 'uncertainty':
        return inferenceResult.images.uncertainty;
      case 'rgb':
      default:
        return inferenceResult.images.super_res;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#5D7052] text-xs font-bold uppercase tracking-wider mb-1.5">
            <Satellite className="w-4 h-4" />
            <span>GeoSR-AI Deep Learning Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C24] font-serif">
            {t('srm_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#78786C] mt-1.5 font-medium">
            {t('srm_subtitle')}
          </p>
        </div>

        {/* Neural Engine Badge */}
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#FEFEFA] border border-[#DED8CF] shadow-soft self-start">
          <Cpu className="w-4 h-4 text-[#5D7052]" />
          <div className="text-xs">
            <span className="text-[#78786C] block text-[10px] uppercase font-bold">Active Framework</span>
            <span className="font-bold text-[#2C2C24] font-serif">PyTorch • {selectedModel.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Controls Left, Viewer Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Preset Selector & Model Config (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Preset Scene Selector */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5D7052]" />
              <span>{t('srm_select_scene')}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {presets.map((p) => {
                const isSelected = selectedPreset === p.id && !uploadedFile;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPreset(p.id);
                      setUploadedFile(null);
                      setUploadPreview(null);
                      runInference(p.id, selectedModel, scaleFactor);
                    }}
                    className={`relative p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#5D7052]/10 border-[#5D7052] text-[#2C2C24] shadow-soft'
                        : 'bg-[#F0EBE5]/50 border-[#DED8CF] text-[#78786C] hover:bg-[#F0EBE5] hover:text-[#2C2C24]'
                    }`}
                  >
                    {p.thumbnail && (
                      <div className="w-full h-16 rounded-xl overflow-hidden mb-2 bg-[#DED8CF]/40">
                        <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-xs font-bold truncate text-[#2C2C24]">{p.title}</p>
                    <span className="text-[10px] text-[#78786C] block truncate font-medium">{p.state}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Upload Dropzone */}
            <div className="mt-5 pt-4 border-t border-[#DED8CF]/60">
              <label className="text-xs font-bold text-[#2C2C24] block mb-2 font-serif">
                {t('srm_or_upload')}
              </label>
              <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-[#DED8CF] hover:border-[#5D7052] bg-[#F0EBE5]/30 cursor-pointer transition">
                <Upload className="w-5 h-5 text-[#78786C] mb-1.5" />
                <span className="text-xs text-[#2C2C24] font-bold">
                  {uploadedFile ? uploadedFile.name : 'Choose Satellite Tile / GeoTIFF'}
                </span>
                <span className="text-[10px] text-[#78786C] mt-0.5 font-medium">PNG, JPG, TIFF (Max 20MB)</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Model Architecture & Scale Factor Selection */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5">
            <div>
              <label className="text-xs font-bold text-[#2C2C24] font-serif uppercase tracking-wider block mb-2.5">
                {t('srm_model_select')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'edsr', label: 'EDSR', badge: 'Best Quality' },
                  { id: 'swinir', label: 'SwinIR', badge: 'Transformer' },
                  { id: 'srcnn', label: 'SRCNN', badge: 'Fastest' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m.id);
                      runInference(selectedPreset, m.id, scaleFactor);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      selectedModel === m.id
                        ? 'bg-[#5D7052] text-[#F3F4F1] border-[#5D7052] font-bold shadow-soft'
                        : 'bg-[#F0EBE5]/60 border-[#DED8CF] text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <span className={`text-[9px] block ${selectedModel === m.id ? 'text-[#F3F4F1]/80' : 'text-[#78786C]'}`}>{m.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2C2C24] font-serif uppercase tracking-wider block mb-2.5">
                {t('srm_scale_factor')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { scale: 2, label: '2x (5.0m)' },
                  { scale: 3, label: '3x (3.3m)' },
                  { scale: 4, label: '4x (2.5m)' }
                ].map((s) => (
                  <button
                    key={s.scale}
                    onClick={() => {
                      setScaleFactor(s.scale);
                      runInference(selectedPreset, selectedModel, s.scale);
                    }}
                    className={`py-2 px-2 rounded-full border text-center text-xs font-bold transition ${
                      scaleFactor === s.scale
                        ? 'bg-[#C18C5D] text-white border-[#C18C5D] shadow-soft'
                        : 'bg-[#F0EBE5]/60 border-[#DED8CF] text-[#78786C] hover:text-[#2C2C24]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => runInference(selectedPreset, selectedModel, scaleFactor)}
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-102 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? t('srm_running') : t('srm_run_btn')}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Interactive Image Comparison Slider & Layers (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Layer Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { id: 'rgb', label: t('srm_layer_rgb'), icon: Eye, color: 'text-[#5D7052]' },
                { id: 'ndvi', label: t('srm_layer_ndvi'), icon: Sprout, color: 'text-[#5D7052]' },
                { id: 'nir', label: t('srm_layer_nir'), icon: Flame, color: 'text-[#C18C5D]' },
                { id: 'uncertainty', label: t('srm_layer_unc'), icon: ShieldAlert, color: 'text-[#A85448]' },
              ].map((layer) => {
                const Icon = layer.icon;
                const isActive = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                      isActive
                        ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft'
                        : 'text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F3F4F1]' : layer.color}`} />
                    <span>{layer.label}</span>
                  </button>
                );
              })}
            </div>

            {inferenceResult && (
              <span className="text-[11px] font-bold text-[#5D7052] px-3 py-1 rounded-full bg-[#5D7052]/10 border border-[#5D7052]/20">
                GSD: {inferenceResult.ground_sampling_distance?.output || '2.50m'}
              </span>
            )}
          </div>

          {/* Interactive Split Slider Viewer */}
          {inferenceResult ? (
            <div className="rounded-[2.25rem] overflow-hidden border border-[#DED8CF] shadow-float bg-[#FEFEFA] p-3">
              <ImageSlider
                lowResImage={inferenceResult.images.low_res}
                highResImage={getActiveLayerImage()}
                lowResLabel={`Original Low-Res (${inferenceResult.ground_sampling_distance?.input || '10m'})`}
                highResLabel={`GeoSR-AI (${inferenceResult.model} ${activeLayer.toUpperCase()})`}
                activeLayer={activeLayer}
              />
            </div>
          ) : (
            <div className="h-[420px] rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col items-center justify-center text-[#78786C] gap-3">
              <Satellite className="w-10 h-10 animate-pulse text-[#5D7052]" />
              <p className="text-sm font-medium">Ready to super-resolve satellite scene...</p>
            </div>
          )}

          {/* Remote Sensing Benchmarks & Metrics Panel */}
          {inferenceResult && inferenceResult.metrics && (
            <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
              <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#5D7052]" />
                  {t('srm_metrics_header')}
                </span>
                <span className="text-[11px] font-medium text-[#78786C]">
                  Calculated against bi-cubic baseline & reference
                </span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center">
                <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                  <span className="text-[10px] uppercase font-bold text-[#78786C] block">PSNR</span>
                  <span className="text-xl font-bold font-serif text-[#5D7052] mt-1 block">{inferenceResult.metrics.psnr} dB</span>
                  <span className="text-[9px] text-[#78786C] block mt-0.5">Peak Signal-to-Noise</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                  <span className="text-[10px] uppercase font-bold text-[#78786C] block">SSIM</span>
                  <span className="text-xl font-bold font-serif text-[#C18C5D] mt-1 block">{inferenceResult.metrics.ssim}</span>
                  <span className="text-[9px] text-[#78786C] block mt-0.5">Structural Similarity</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                  <span className="text-[10px] uppercase font-bold text-[#78786C] block">SAM</span>
                  <span className="text-xl font-bold font-serif text-[#78786C] mt-1 block">{inferenceResult.metrics.sam}°</span>
                  <span className="text-[9px] text-[#78786C] block mt-0.5">Spectral Angle Mapper</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                  <span className="text-[10px] uppercase font-bold text-[#78786C] block">ERGAS</span>
                  <span className="text-xl font-bold font-serif text-[#5D7052] mt-1 block">{inferenceResult.metrics.ergas}</span>
                  <span className="text-[9px] text-[#78786C] block mt-0.5">Synthesis Error Index</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                  <span className="text-[10px] uppercase font-bold text-[#78786C] block">RMSE</span>
                  <span className="text-xl font-bold font-serif text-[#A85448] mt-1 block">{inferenceResult.metrics.rmse}</span>
                  <span className="text-[9px] text-[#78786C] block mt-0.5">Root Mean Square</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
