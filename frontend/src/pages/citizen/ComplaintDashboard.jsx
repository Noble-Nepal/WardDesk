import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";

import { getAllComplaints, getComplaintCategories } from "../../api/complaintApi";
import ComplaintCard from "../../components/complaint/ComplaintCard";
import ComplaintDetails from "../../components/complaint/complaintDetails/ComplaintDetails";
import HowItWorks from "../../components/home/HowItWorks";
import { ITEMS_PER_PAGE } from "../../constants/dashboardConstants";

export default function ComplaintDashboard() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    Promise.all([
      getAllComplaints(),
      getComplaintCategories(),
    ])
      .then(([complaintsRes, categoriesRes]) => {
        setComplaints(complaintsRes.data || []);
        setCategories(categoriesRes.data || []);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load complaints.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const matchesCategory =
      activeFilter === "all" ||
      c.categoryName === activeFilter;

    const q = searchQuery?.trim().toLowerCase() || "";
    const matchesSearch =
      !q ||
      c.title?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.categoryName?.toLowerCase().includes(q) ||
      c.locationAddress?.toLowerCase().includes(q) ||
      c.citizenName?.toLowerCase().includes(q) ||
      c.trackingId?.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const sortedComplaints = [...filteredComplaints].sort(
    (a, b) => b.netVotes - a.netVotes,
  );

  const visibleComplaints = sortedComplaints.slice(0, visibleCount);
  const hasMore = visibleCount < sortedComplaints.length;

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [activeFilter, searchQuery]);

  const filters = [
    { key: "all", label: "All Issues" },
    ...categories.map((cat) => ({ key: cat.categoryName, label: cat.categoryName })),
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complaint Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Browse and vote on community issues</p>
          </div>
          <button
            onClick={() => navigate("/citizen/report-issue")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-5 bg-[#2B4AA0] hover:bg-[#1d3570] text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Search + Filters card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 sm:px-6 py-5">

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, category, location, tracking ID…"
              className="w-full pl-10 pr-9 h-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B4AA0] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeFilter === filter.key
                    ? "bg-[#2B4AA0] text-white border-[#2B4AA0] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#2B4AA0] hover:text-[#2B4AA0]"
                }`}
              >
                {filter.label}
                {filter.key !== "all" && (
                  <span className={`ml-1.5 text-xs ${activeFilter === filter.key ? "text-blue-200" : "text-gray-400"}`}>
                    {complaints.filter((c) => c.categoryName === filter.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results header */}
        {!loading && !error && (
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-gray-500">
              {sortedComplaints.length === 0
                ? "No complaints found"
                : `${sortedComplaints.length} complaint${sortedComplaints.length !== 1 ? "s" : ""} · sorted by votes`}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2B4AA0] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading complaints…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-white rounded-xl border border-red-200 shadow-sm py-16 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && sortedComplaints.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 text-center">
            <p className="text-sm text-gray-400">No complaints match your search or filter.</p>
          </div>
        )}

        {/* Complaint Cards */}
        {!loading && !error && visibleComplaints.length > 0 && (
          <div className="space-y-3">
            {visibleComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.complaintId}
                complaint={complaint}
                onViewDetails={setSelectedComplaint}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              className="inline-flex items-center gap-2 h-10 px-8 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Load More
            </button>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <HowItWorks />
        </div>
      </div>

      {selectedComplaint && (
        <ComplaintDetails
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          issueData={{
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
            photoUrls: selectedComplaint.photoUrls || [],
            photos: selectedComplaint.photoUrls || [],
            workPhotoUrls: selectedComplaint.workPhotoUrls || [],
            latitude: selectedComplaint.latitude,
            longitude: selectedComplaint.longitude,
          }}
        />
      )}
    </div>
  );
}
