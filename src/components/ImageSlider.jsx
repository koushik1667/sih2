import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  SlidersHorizontal, 
  Columns2, 
  Layers, 
  Eye, 
  Maximize2, 
  Minimize2,
  Sparkles,
  Move,
  Info
} from 'lucide-react';

export const ImageSlider = ({
  lowResImage,
  highResImage,
  lowResLabel = "Medium-Res (10m/px Sentinel-2)",
  highResLabel = "Super-Resolved SRM (2.5m/px)",
  activeLayer = "rgb",
  gsd = "2.50m",
  coordinates = { lat: 30.9010, lng: 75.8573 }
}) => {
  // Modes: 'slider' (split slider), 'side_by_side' (dual sync), 'onion' (opacity crossfade), 'blink' (rapid toggle)
  const [viewMode, setViewMode] = useState('slider'); 
  const [sliderPosition, setSliderPosition] = useState(50);
  const [onionOpacity, setOnionOpacity] = useState(0.85);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, active: false });

  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  // Handle Split Slider Dragging
  const handleSliderMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handlePointerDown = (e) => {
    if (e.button === 0 && (e.shiftKey || zoom > 1)) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else {
      setIsDragging(true);
      handleSliderMove(e.clientX);
    }
  };

  const handlePointerMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width);
      const relY = ((e.clientY - rect.top) / rect.height);
      setCursorPos({
        x: Math.max(0, Math.min(1, relX)),
        y: Math.max(0, Math.min(1, relY)),
        active: true
      });
    }

    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    } else if (isDragging && viewMode === 'slider') {
      handleSliderMove(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSliderPosition(50);
  };

  // Keyboard shortcut for quick blinking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && viewMode === 'blink') {
        e.preventDefault();
        setIsBlinking(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  // Estimated coordinate calculation from cursor
  const currentLat = (coordinates.lat + (0.5 - cursorPos.y) * 0.008).toFixed(4);
  const currentLng = (coordinates.lng + (cursorPos.x - 0.5) * 0.008).toFixed(4);

  return (
    <div className={`relative w-full rounded-[2.25rem] overflow-hidden bg-[#FEFEFA] border border-[#DED8CF] shadow-soft select-none transition-all ${isFullscreen ? 'fixed inset-4 z-50 rounded-3xl bg-[#FEFEFA]' : ''}`}>
      
      {/* Top Interactive Mode & Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#F0EBE5]/50 border-b border-[#DED8CF]">
        
        {/* Comparison Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-xs font-bold shadow-soft">
          {[
            { id: 'slider', label: 'Split Slider', icon: SlidersHorizontal },
            { id: 'side_by_side', label: 'Side-by-Side', icon: Columns2 },
            { id: 'onion', label: 'Onion Skin', icon: Layers },
            { id: 'blink', label: 'Blink Toggle', icon: Eye },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                  isActive
                    ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft'
                    : 'text-[#78786C] hover:text-[#2C2C24]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport Zoom & Fullscreen Controls */}
        <div className="flex items-center gap-2">
          {viewMode === 'onion' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-xs">
              <span className="text-[10px] uppercase font-bold text-[#78786C]">SR Blend:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={onionOpacity}
                onChange={(e) => setOnionOpacity(parseFloat(e.target.value))}
                className="w-20 accent-[#5D7052] cursor-pointer"
              />
              <span className="font-mono text-[#5D7052] font-bold text-[11px]">
                {Math.round(onionOpacity * 100)}%
              </span>
            </div>
          )}

          {viewMode === 'blink' && (
            <button
              onClick={() => setIsBlinking(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5D7052] text-[#F3F4F1] text-xs font-bold shadow-soft animate-pulse"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Showing: {isBlinking ? 'Original Low-Res' : 'Super-Resolved'}</span>
            </button>
          )}

          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-xs shadow-soft">
            <button
              onClick={() => setZoom(prev => Math.max(1, prev - 0.25))}
              disabled={zoom <= 1}
              className="p-1 rounded-full hover:bg-[#F0EBE5] text-[#78786C] hover:text-[#2C2C24] transition disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-serif text-[#5D7052] text-[11px] font-bold px-1.5">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
              disabled={zoom >= 3}
              className="p-1 rounded-full hover:bg-[#F0EBE5] text-[#78786C] hover:text-[#2C2C24] transition disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              className="p-1 rounded-full hover:bg-[#F0EBE5] text-[#78786C] hover:text-[#2C2C24] transition ml-1"
              title="Reset View / Center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-2 rounded-full bg-[#FEFEFA] hover:bg-[#F0EBE5] border border-[#DED8CF] text-[#78786C] hover:text-[#2C2C24] transition shadow-soft"
            title={isFullscreen ? "Exit Fullscreen" : "Expand Viewer"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Main Canvas Viewport Area */}
      <div
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => {
          handlePointerUp();
          setCursorPos(prev => ({ ...prev, active: false }));
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleSliderMove(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          if (isDragging && viewMode === 'slider') {
            handleSliderMove(e.touches[0].clientX);
          }
        }}
        onTouchEnd={handlePointerUp}
        className={`relative w-full ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'h-[440px] sm:h-[500px]'} bg-[#1E272E] flex items-center justify-center overflow-hidden ${
          zoom > 1 ? 'cursor-grab active:cursor-grabbing' : viewMode === 'slider' ? 'cursor-ew-resize' : 'cursor-default'
        }`}
      >
        
        {/* Render View Mode: 1. Split Slider */}
        {viewMode === 'slider' && (
          <>
            {/* Background: High-Res / Active Layer */}
            <div 
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-75"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
              }}
            >
              <img
                src={highResImage}
                alt="Super-Resolved"
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* Foreground: Low-Res Layer Clipped to Slider Position */}
            <div
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden transition-transform duration-75"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
              }}
            >
              <img
                src={lowResImage}
                alt="Original Medium-Res"
                className="w-full h-full object-contain pointer-events-none filter blur-[0.4px]"
              />
            </div>

            {/* Draggable Divider Line & Handle */}
            <div
              ref={sliderRef}
              className="absolute top-0 bottom-0 z-20 w-1 bg-[#FEFEFA] shadow-soft cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#5D7052] border-2 border-[#FEFEFA] flex items-center justify-center shadow-soft text-white hover:scale-110 transition">
                <SlidersHorizontal className="w-4 h-4 text-[#F3F4F1]" />
              </div>
            </div>
          </>
        )}

        {/* Render View Mode: 2. Side-by-Side Dual View */}
        {viewMode === 'side_by_side' && (
          <div className="grid grid-cols-2 w-full h-full divide-x-2 divide-[#DED8CF]/40">
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#243038]/50">
              <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
              >
                <img src={lowResImage} alt="Low-Res" className="w-full h-full object-contain" />
              </div>
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1E272E]/80 text-[#FEFEFA] text-[10px] font-bold">
                10m Native Sentinel-2
              </span>
            </div>

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#1E272E]">
              <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
              >
                <img src={highResImage} alt="Super-Res" className="w-full h-full object-contain" />
              </div>
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#5D7052]/90 text-[#F3F4F1] text-[10px] font-bold">
                GeoSR-AI {activeLayer.toUpperCase()} ({gsd})
              </span>
            </div>
          </div>
        )}

        {/* Render View Mode: 3. Onion Skin / Opacity Crossfade */}
        {viewMode === 'onion' && (
          <div 
            className="relative w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
          >
            <img src={lowResImage} alt="Low-Res Base" className="absolute inset-0 w-full h-full object-contain" />
            <img 
              src={highResImage} 
              alt="Super-Res Overlay" 
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-150"
              style={{ opacity: onionOpacity }}
            />
          </div>
        )}

        {/* Render View Mode: 4. Blink / Rapid Toggle */}
        {viewMode === 'blink' && (
          <div 
            className="relative w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
          >
            <img 
              src={isBlinking ? lowResImage : highResImage} 
              alt={isBlinking ? "Low-Res" : "High-Res"} 
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Bottom Informational Floating Badges */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-[#FEFEFA]/95 backdrop-blur-md border border-[#DED8CF] text-[11px] font-bold text-[#2C2C24] font-serif shadow-soft">
            {lowResLabel}
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-[#5D7052]/95 backdrop-blur-md border border-[#5D7052] text-[11px] font-bold text-[#F3F4F1] font-serif shadow-soft flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{highResLabel}</span>
          </div>
        </div>

        {/* Spectral / Analytical Colorbar Legend Overlay (When layer is NDVI, NIR, or Uncertainty) */}
        {activeLayer === 'ndvi' && (
          <div className="absolute top-4 left-4 z-20 p-2.5 rounded-2xl bg-[#FEFEFA]/90 backdrop-blur-md border border-[#DED8CF] shadow-soft max-w-xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#2C2C24] mb-1">
              <span>NDVI Biomass Scale</span>
              <span className="text-[#5D7052]">0.0 → 1.0</span>
            </div>
            <div className="h-2.5 w-48 rounded-full bg-gradient-to-r from-[#D4AC0D] via-[#3CB371] to-[#006400] border border-[#DED8CF]" />
            <div className="flex justify-between text-[9px] text-[#78786C] mt-1 font-medium">
              <span>Bare / Fallow</span>
              <span>Moderate</span>
              <span>Lush Canopy</span>
            </div>
          </div>
        )}

        {activeLayer === 'uncertainty' && (
          <div className="absolute top-4 left-4 z-20 p-2.5 rounded-2xl bg-[#FEFEFA]/90 backdrop-blur-md border border-[#DED8CF] shadow-soft max-w-xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#2C2C24] mb-1">
              <span>Epistemic Uncertainty</span>
              <span className="text-[#A85448]">Low → High</span>
            </div>
            <div className="h-2.5 w-48 rounded-full bg-gradient-to-r from-[#18212B] via-[#F39C12] to-[#E74C3C] border border-[#DED8CF]" />
            <div className="flex justify-between text-[9px] text-[#78786C] mt-1 font-medium">
              <span>High Conf (Interior)</span>
              <span>Edge Boundary</span>
              <span>Variance</span>
            </div>
          </div>
        )}

        {/* Live Pixel Inspector HUD */}
        {cursorPos.active && (
          <div className="absolute bottom-14 left-4 z-20 px-3 py-1 rounded-full bg-[#1E272E]/90 backdrop-blur-md border border-[#DED8CF]/30 text-[10px] text-[#FEFEFA] font-mono shadow-soft flex items-center gap-2.5">
            <span>📍 {currentLat}°N, {currentLng}°E</span>
            <span>•</span>
            <span>GSD: {gsd}</span>
            <span>•</span>
            <span className="text-[#A3E635]">Layer: {activeLayer.toUpperCase()}</span>
          </div>
        )}

      </div>

      {/* Footer Navigation & Hint Bar */}
      <div className="px-5 py-2.5 bg-[#F0EBE5]/50 border-t border-[#DED8CF] flex flex-wrap items-center justify-between text-[11px] text-[#78786C] gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#5D7052]" />
          <span>
            {viewMode === 'slider' && "Drag split slider horizontally to compare spectral resolution."}
            {viewMode === 'side_by_side' && "Dual synchronized side-by-side view with coordinated pan & zoom."}
            {viewMode === 'onion' && "Use the blend slider above to crossfade layer opacity."}
            {viewMode === 'blink' && "Press Spacebar or click toggle above to flash compare."}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          {zoom > 1 && (
            <span className="text-[#C18C5D] font-bold flex items-center gap-1">
              <Move className="w-3 h-3" /> Shift + Drag to Pan
            </span>
          )}
          {viewMode === 'slider' && (
            <span className="text-[#5D7052] font-bold">
              Split: {Math.round(sliderPosition)}% / {100 - Math.round(sliderPosition)}%
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
