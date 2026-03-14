import { useState, useEffect, useMemo, useCallback } from "react";
import { getMyComplaints } from "../../api/complaintApi";
import ComplaintCard from "../../components/complaint/ComplaintCard";
import ComplaintDetails from "../../components/complaint/complaintDetails/ComplaintDetails";

// ─── helpers ───
const normalize = (s) => s?.toLowerCase() || "";

const countByStatus = (complaints, test) =>
  complaints.filter((c) => test(normalize(c.statusName))).length;

// ─── stats card config (DRY) ───
const STATS = [
  {
    key: "total",
    label: "Total Complaints",
    sub: "All time",
    test: () => true,
    bg: "bg-white",
    border: "border-gray-200",
    labelColor: "text-gray-600",
    numColor: "text-gray-900",
    subColor: "text-gray-500",
  },
  {
    key: "pending",
    label: "Pending",
    sub: "Awaiting review",
    test: (s) => s === "pending",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    labelColor: "text-yellow-700",
    numColor: "text-yellow-900",
    subColor: "text-yellow-600",
  },
  {
    key: "progress",
    label: "In Progress",
    sub: "Being worked on",
    test: (s) => s === "in progress" || s === "assigned",
    bg: "bg-blue-50",
    border: "border-blue-200",
    labelColor: "text-blue-700",
    numColor: "text-blue-900",
    subColor: "text-blue-600",
  },
  {
    key: "resolved",
    label: "Resolved",
    sub: "Successfully fixed",
    test: (s) => s === "resolved",
    bg: "bg-green-50",
    border: "border-green-200",
    labelColor: "text-green-700",
    numColor: "text-green-900",
    subColor: "text-green-600",
  },
];

// ─── filter-tab config (DRY) ───
const FILTERS = [
  { key: "all", label: "All", test: () => true },
  { key: "pending", label: "Pending", test: (s) => s === "pending" },
  {
    key: "progress",
    label: "In Progress",
    test: (s) => s === "in progress" || s === "assigned",
  },
  { key: "resolved", label: "Resolved", test: (s) => s === "resolved" },
];

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // ─── fetch ───
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyComplaints();
        setComplaints(res.data ?? []);
      } catch {
        setError("Failed to load your complaints.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ─── derived counts ───
  const counts = useMemo(() => {
    const map = {};
    STATS.forEach(({ key, test }) => {
      map[key] = countByStatus(complaints, (s) => test(s));
    });
    FILTERS.forEach(({ key, test }) => {
      if (!(key in map)) map[key] = countByStatus(complaints, (s) => test(s));
    });
    map.all = complaints.length;
    return map;
  }, [complaints]);

  // ─── filtered list ───
  const filtered = useMemo(() => {
    const f = FILTERS.find((f) => f.key === activeFilter);
    return complaints.filter((c) => f.test(normalize(c.statusName)));
  }, [complaints, activeFilter]);

  // ─── modal helpers ───
  const handleViewDetails = useCallback((complaint) => {
    setSelectedComplaint(complaint);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedComplaint(null);
  }, []);

  const issueData = useMemo(() => {
    if (!selectedComplaint) return null;
    return {
      id: selectedComplaint.trackingId,
      title: selectedComplaint.title,
      description: selectedComplaint.description || "",
      category: selectedComplaint.categoryName,
      location: selectedComplaint.locationAddress || "",
      submittedBy: selectedComplaint.citizenName || "",
      priority: selectedComplaint.priorityLevel,
      ward: selectedComplaint.wardNumber,
      votes: selectedComplaint.netVotes || 0,
      isVerified: selectedComplaint.isVerified || false,
      status: selectedComplaint.statusName,
      date: new Date(selectedComplaint.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
  }, [selectedComplaint]);

  // ─── render ───
  return (
    <div className="bg-white min-h-screen">
      {/* ════════ HEADER ════════ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Complaints
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Track and manage all your reported issues
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* ════════ STATS ════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {STATS.map(
            ({
              key,
              label,
              sub,
              bg,
              border,
              labelColor,
              numColor,
              subColor,
            }) => (
              <div
                key={key}
                className={`${bg} border-2 ${border} rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow`}
              >
                <p className={`text-xs sm:text-sm ${labelColor}`}>{label}</p>
                <p
                  className={`text-2xl sm:text-3xl ${numColor} font-bold mt-1`}
                >
                  {counts[key] ?? 0}
                </p>
                <p className={`text-xs ${subColor} mt-1`}>{sub}</p>
              </div>
            ),
          )}
        </div>

        {/* ════════ LIST SECTION ════════ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {/* filter tabs */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto border-b border-gray-200 pb-4 mb-4 sm:mb-6">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === key
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label} ({counts[key] ?? 0})
              </button>
            ))}
          </div>

          {/* states */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3" />
              <span className="text-gray-500">Loading your complaints...</span>
            </div>
          )}

          {error && !loading && (
            <p className="text-center text-red-500 py-12">{error}</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No complaints found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try changing the filter or report a new issue
              </p>
            </div>
          )}

          {/* complaint cards */}
          {!loading && !error && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map((complaint) => (
                <ComplaintCard
                  key={complaint.complaintId}
                  complaint={complaint}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════════ DETAIL MODAL (reused) ════════ */}
      <ComplaintDetails
        isOpen={!!selectedComplaint}
        onClose={handleClose}
        issueData={issueData}
      />
    </div>
  );
};

export default MyComplaints;
