import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, SlidersHorizontal } from 'lucide-react';

export const ImageSlider = ({
  lowResImage,
  highResImage,
  lowResLabel = "Medium-Res (10m/px Sentinel-2)",
  highResLabel = "Super-Resolved SRM (2.5m/px)",
  activeLayer = "rgb"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden bg-[#F0EBE5]/40 border border-[#DED8CF] shadow-soft select-none">
      {/* Zoom and Overlay Toolbar */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-[#FEFEFA]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#DED8CF] shadow-soft text-xs">
        <button 
          onClick={() => setZoom(prev => Math.max(1, prev - 0.25))}
          className="p-1 rounded-full hover:bg-[#F0EBE5] text-[#78786C] hover:text-[#2C2C24] transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="font-serif text-[#5D7052] text-[11px] font-bold">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={() => setZoom(prev => Math.min(2.5, prev + 0.25))}
          className="p-1 rounded-full hover:bg-[#F0EBE5] text-[#78786C] hover:text-[#2C2C24] transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Image Slider Viewport */}
      <div
        ref={containerRef}
        className="relative w-full h-[420px] sm:h-[480px] bg-[#2C2C24]/10 flex items-center justify-center overflow-hidden cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* High-Resolution / Active Layer Layer (Right / Background) */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-100"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={highResImage}
            alt="Super-Resolved"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Low-Resolution Layer (Left / Clipped Overlay) */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-100 overflow-hidden"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            transform: `scale(${zoom})`
          }}
        >
          <img
            src={lowResImage}
            alt="Original Medium-Res"
            className="w-full h-full object-contain pointer-events-none filter blur-[0.4px]"
          />
        </div>

        {/* Slider Divider Line & Thumb */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-[#5D7052] shadow-soft cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#5D7052] border-2 border-[#FEFEFA] flex items-center justify-center shadow-soft text-white">
            <SlidersHorizontal className="w-4 h-4 text-[#F3F4F1]" />
          </div>
        </div>

        {/* Left / Right Informational Badges */}
        <div className="absolute bottom-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-[#FEFEFA]/90 backdrop-blur-md border border-[#DED8CF] text-[11px] font-bold text-[#2C2C24] font-serif shadow-soft">
          {lowResLabel}
        </div>
        <div className="absolute bottom-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-[#5D7052]/90 backdrop-blur-md border border-[#5D7052] text-[11px] font-bold text-[#F3F4F1] font-serif shadow-soft">
          {highResLabel}
        </div>
      </div>

      {/* Slider Hint Footer */}
      <div className="px-4 py-2 bg-[#2C2C24]/10 border-t border-[#DED8CF] flex items-center justify-between text-[11px] text-[#78786C]">
        <span>◀ Drag slider horizontally to compare spectral & boundary clarity ▶</span>
        <span className="font-mono text-[#5D7052]">Split: {Math.round(sliderPosition)}% / {100 - Math.round(sliderPosition)}%</span>
      </div>
    </div>
  );
};
