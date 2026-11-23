import React, { useState } from "react";
import { DollarSign, ChevronLeft, ChevronRight } from "lucide-react";

// Photo slider for listing cards. The arrows and dots don't trigger the card's link.
export default function ImageCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  if (total === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <DollarSign className="w-12 h-12 text-gray-300" />
      </div>
    );
  }
  const go = (e, next) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx(next);
  };
  return (
    <>
      <img key={idx} src={images[idx]} alt="" className="w-full h-full object-cover transition-opacity duration-300" />
      {total > 1 && (
        <>
          <button aria-label="Previous photo" onClick={(e) => go(e, (idx - 1 + total) % total)} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors z-10">
            <ChevronLeft size={14} />
          </button>
          <button aria-label="Next photo" onClick={(e) => go(e, (idx + 1) % total)} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors z-10">
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button key={i} aria-label={`Photo ${i + 1}`} onClick={(e) => go(e, i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white scale-125" : "bg-white/50"}`} />
            ))}
          </div>
          <div className="absolute top-4 right-4 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full z-10">
            {idx + 1}/{total}
          </div>
        </>
      )}
    </>
  );
}
