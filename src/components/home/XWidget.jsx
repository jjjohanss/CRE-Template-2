import React, { useEffect, useRef } from "react";

export default function XWidget() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.dataset.loaded) {
      containerRef.current.innerHTML =
        '<a href="https://x.com/farisleeinvest?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-show-count="false">Follow @farisleeinvest</a>';

      if (!window.document.getElementById("x-widgets-script")) {
        const script = document.createElement("script");
        script.id = "x-widgets-script";
        script.src = "https://platform.x.com/widgets.js";
        script.async = true;
        script.charset = "utf-8";
        document.body.appendChild(script);
      } else if (window.twttr?.widgets?.load) {
        window.twttr.widgets.load(containerRef.current);
      }

      containerRef.current.dataset.loaded = "true";
    }
  }, []);

  return (
    <div className="mt-16 flex justify-center">
      <div className="w-full max-w-[600px]">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-[#0A1628] text-sm tracking-[0.25em] uppercase font-semibold">Follow On X For Updates
          </h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <div ref={containerRef} className="min-h-[60px]" />
      </div>
    </div>
  );
}