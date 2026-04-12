import { useState } from "react";
import { Sparkles, ShieldAlert, Wrench, Loader2 } from "lucide-react";
import { getActionPlan } from "../../../api/complaintApi";

const SmartActionPlan = ({ category, description }) => {
  const [actionPlan, setActionPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (actionPlan || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await getActionPlan(category, description);
      setActionPlan(res.data);
    } catch {
      setError("Could not generate action plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2B4AA0]" />
          <span className="text-sm font-semibold text-gray-800">Smart Action Plan</span>
          <span className="text-[10px] px-2 py-0.5 bg-[#2B4AA0] text-white rounded-full font-medium tracking-wide">
            AI
          </span>
        </div>
        {!actionPlan && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="h-7 px-3 bg-[#2B4AA0] hover:bg-[#1d3570] disabled:opacity-60 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors"
          >
            {loading ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="w-3 h-3" /> Generate</>
            )}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2.5 text-xs text-red-600 bg-red-50 border-b border-red-100">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="px-4 py-5 grid grid-cols-2 gap-4">
          {[0, 1].map((col) => (
            <div key={col} className="space-y-2">
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
              {[0, 1, 2].map((r) => (
                <div
                  key={r}
                  className="h-2.5 bg-gray-100 rounded animate-pulse"
                  style={{ width: `${70 + r * 10}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      {actionPlan && (
        <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Safety Advice */}
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 mb-2.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Safety Advice
            </p>
            <ul className="space-y-2">
              {actionPlan.safetyAdvice.map((tip, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-700 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Temporary Measures */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-[#2B4AA0] mb-2.5">
              <Wrench className="w-3.5 h-3.5" />
              Temporary Measures
            </p>
            <ul className="space-y-2">
              {actionPlan.temporaryMeasures.map((tip, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-700 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2B4AA0] shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Idle — not yet generated */}
      {!actionPlan && !loading && !error && (
        <p className="px-4 py-4 text-center text-xs text-gray-400">
          Get AI-generated safety tips and temporary measures for this issue.
        </p>
      )}
    </div>
  );
};

export default SmartActionPlan;
