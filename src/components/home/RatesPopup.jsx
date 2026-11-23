import React, { useState, useEffect } from "react";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import { api } from "@/api/client";

export default function RatesPopup({ onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await api.functions.invoke("getTreasuryRates", {});
        if (response.data?.error) throw new Error(response.data.error);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const rates = [
    { key: "y5", label: "5-Year Treasury" },
    { key: "y10", label: "10-Year Treasury" },
    { key: "y30", label: "30-Year Treasury" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 bg-[#F5F5F7]">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-10 h-0.5 bg-[#C8102E] mb-3" />
              <h2 className="text-neutral-900 font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                Today's Market Rates
              </h2>
              <p className="text-gray-500 text-xs mt-1">U.S. Treasury Par Yield Curve</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Unable to load rates at this time.</p>
              <p className="text-gray-400 text-xs mt-2">Please try again later.</p>
            </div>
          )}

          {data && !loading && (
            <>
              <div className="space-y-3">
                {rates.map((r) => {
                  const value = data.rates?.[r.key];
                  const change = data.changes?.[r.key];
                  const isUp = change != null && change > 0;
                  const isDown = change != null && change < 0;
                  return (
                    <div key={r.key} className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl">
                      <div>
                        <p className="text-gray-500 text-xs tracking-wider uppercase font-medium">{r.label}</p>
                        {change != null && (
                          <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${isUp ? "text-green-600" : isDown ? "text-red-600" : "text-gray-400"}`}>
                            {isUp && <ArrowUp size={12} />}
                            {isDown && <ArrowDown size={12} />}
                            {change > 0 ? "+" : ""}{change.toFixed(3)}
                          </div>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-neutral-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {value != null ? `${value.toFixed(3)}%` : "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-400 text-xs text-center mt-5">
                As of {formatDate(data.date)}
              </p>
              <p className="text-gray-300 text-[10px] text-center mt-1">
                Source: U.S. Department of the Treasury
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}