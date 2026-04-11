import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  ClipboardList,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import ErrorAlert from "../../components/ui/ErrorAlert";

import ComplaintFilterBar from "../../components/adminComplaintManagement/ComplaintFilterBar";
import ComplaintList from "../../components/adminComplaintManagement/ComplaintList";
import ComplaintDetailsPanel from "../../components/adminComplaintManagement/ComplaintDetailsPanel";

import {
  getAdminComplaints,
  getAdminComplaintById,
  verifyAdminComplaint,
  unverifyAdminComplaint,
  updateAdminComplaintCategory,
  updateAdminComplaintStatus,
  downloadAdminComplaintsPdf,
  getComplaintCategories,
} from "../../api/adminComplaintManagementApi";

import { DEFAULT_FILTERS } from "../../constants/adminComplaintManagementConstants";
import {
  buildComplaintFiltersForApi,
  downloadBlobFile,
} from "../../utils/adminComplaintManagementUtils";

const STATS_CONFIG = [
  {
    label: "Total Complaints",
    color: "bg-[#2B4AA0]",
    Icon: ClipboardList,
    key: "total",
  },
  { label: "Pending", color: "bg-orange-500", Icon: Clock, key: "pending" },
  {
    label: "In Progress",
    color: "bg-blue-500",
    Icon: AlertCircle,
    key: "inProgress",
  },
  {
    label: "Verified",
    color: "bg-emerald-500",
    Icon: ShieldCheck,
    key: "verified",
  },
];

const ComplaintManagementDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [selectedComplaintDetail, setSelectedComplaintDetail] = useState(null);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [listLoading, setListLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [error, setError] = useState("");

  const apiFilters = useMemo(
    () => buildComplaintFiltersForApi(filters),
    [filters],
  );

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(
      (c) => String(c.statusName).toLowerCase() === "pending",
    ).length;
    const inProgress = complaints.filter((c) =>
      ["assigned", "in_progress"].includes(String(c.statusName).toLowerCase()),
    ).length;
    const verified = complaints.filter((c) => c.isVerified).length;
    return { total, pending, inProgress, verified };
  }, [complaints]);

  const loadComplaints = async (activeFilters = apiFilters) => {
    setListLoading(true);
    setError("");
    try {
      const data = await getAdminComplaints(activeFilters);
      const list = Array.isArray(data) ? data : [];
      setComplaints(list);
      if (list.length === 0) {
        setSelectedComplaintId(null);
        setSelectedComplaintDetail(null);
      }
    } catch {
      setError("Failed to load complaints.");
    } finally {
      setListLoading(false);
    }
  };

  const loadComplaintDetail = async (complaintId) => {
    if (!complaintId) {
      setSelectedComplaintDetail(null);
      return;
    }
    setDetailLoading(true);
    setError("");
    try {
      const data = await getAdminComplaintById(complaintId);
      setSelectedComplaintDetail(data || null);
    } catch {
      setError("Failed to load complaint details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshAll = async () => {
    await loadComplaints();
    if (selectedComplaintId) {
      await loadComplaintDetail(selectedComplaintId);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const c = await getComplaintCategories();
        setCategories(Array.isArray(c) ? c : []);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadComplaints(apiFilters);
    }, 300);
    return () => clearTimeout(timer);
  }, [apiFilters]); // eslint-disable-line

  useEffect(() => {
    loadComplaintDetail(selectedComplaintId);
  }, [selectedComplaintId]); // eslint-disable-line

  const handleCloseModal = () => {
    setSelectedComplaintId(null);
    setSelectedComplaintDetail(null);
  };

  // Panel owns success/error messaging — these just run the API + refresh, throwing on failure
  const onVerify = async () => {
    await verifyAdminComplaint(selectedComplaintId);
    await refreshAll();
  };

  const onUnverify = async () => {
    await unverifyAdminComplaint(selectedComplaintId);
    await refreshAll();
  };

  const onUpdateCategory = async (categoryId) => {
    await updateAdminComplaintCategory(selectedComplaintId, categoryId);
    await refreshAll();
  };

  const onUpdateStatus = async (statusName) => {
    await updateAdminComplaintStatus(selectedComplaintId, statusName);
    await refreshAll();
  };

  const onDownloadPdf = async () => {
    setPdfLoading(true);
    setError("");
    try {
      const blob = await downloadAdminComplaintsPdf(apiFilters);
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      downloadBlobFile(blob, `complaints-report-${stamp}.pdf`);
    } catch {
      setError("Failed to download PDF report.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Complaint Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage complaint verification, status, and category
            </p>
          </div>
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={pdfLoading}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#2B4AA0] hover:bg-[#1f3a82] text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
          >
            <FileText className="w-4 h-4" />
            <span>{pdfLoading ? "Downloading..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <ErrorAlert message={error} />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STATS_CONFIG.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center gap-3"
            >
              <div
                className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center shrink-0`}
              >
                <card.Icon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">{card.label}</p>
                <p className="text-2xl font-semibold text-gray-900 leading-tight mt-0.5">
                  {stats[card.key] ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ComplaintFilterBar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />

        <ComplaintList
          complaints={complaints}
          onView={setSelectedComplaintId}
          loading={listLoading}
        />
      </div>

      <ComplaintDetailsPanel
        open={!!selectedComplaintId}
        complaint={selectedComplaintDetail}
        categories={categories}
        loading={detailLoading}
        onClose={handleCloseModal}
        onVerify={onVerify}
        onUnverify={onUnverify}
        onUpdateCategory={onUpdateCategory}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
};

export default ComplaintManagementDashboard;
