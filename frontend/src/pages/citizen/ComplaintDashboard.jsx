import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { MdAdd } from "react-icons/md";

import { getAllComplaints } from "../../api/complaintApi";
import ComplaintCard from "../../components/complaint/ComplaintCard";
import ComplaintDetails from "../../components/complaint/complaintDetails/ComplaintDetails";
import HowItWorks from "../../components/home/HowItWorks";
import {
  CATEGORY_FILTERS,
  ITEMS_PER_PAGE,
} from "../../constants/dashboardConstants";

export default function ComplaintDashboard() {
  const navigate = useNavigate();
  const { searchQuery = "" } = useOutletContext();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    getAllComplaints()
      .then((res) => setComplaints(res.data))
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load complaints.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const matchesCategory =
      activeFilter === "all" ||
      c.categoryName?.toLowerCase() === activeFilter.toLowerCase();

    const q = searchQuery?.toLowerCase() || "";
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

  // Open ComplaintDetails modal
  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* HEADER  */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Complaint Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              View and vote on community issues
            </p>
          </div>
          <button
            onClick={() => navigate("/citizen/report-issue")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <MdAdd className="w-4 h-4" />
            Report New Issue
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* TOP VOTED ISSUES  */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Top Voted Issues
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Help prioritize community issues by voting
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading complaints...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && sortedComplaints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No complaints found.</p>
            </div>
          )}

          {/* Complaint Cards */}
          {!loading && !error && (
            <div className="space-y-4">
              {visibleComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.complaintId}
                  complaint={complaint}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && !loading && (
            <div className="text-center mt-6 sm:mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 border border-red-500 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>

        {/* HOW IT WORKS (reused)  */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
            date: new Date(selectedComplaint.createdAt).toLocaleDateString(
              "en-US",
              { year: "numeric", month: "short", day: "numeric" },
            ),
          }}
        />
      )}
    </div>
  );
}
