import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ErrorAlert from "../../components/ui/ErrorAlert";
import SuccessToast from "../../components/ui/SuccessToast";

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

const ComplaintManagementDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [selectedComplaintDetail, setSelectedComplaintDetail] = useState(null);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [listLoading, setListLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [error, setError] = useState("");

  const apiFilters = useMemo(
    () => buildComplaintFiltersForApi(filters),
    [filters],
  );

  const loadComplaints = async (activeFilters = apiFilters) => {
    setListLoading(true);
    setError("");
    try {
      const data = await getAdminComplaints(activeFilters);
      const list = Array.isArray(data) ? data : [];
      setComplaints(list);

      if (!selectedComplaintId && list.length > 0) {
        setSelectedComplaintId(list[0].complaintId);
      }

      if (
        selectedComplaintId &&
        list.length > 0 &&
        !list.some((x) => x.complaintId === selectedComplaintId)
      ) {
        setSelectedComplaintId(list[0].complaintId);
      }

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

  const onVerify = async () => {
    if (!selectedComplaintId) return;
    setActionLoading(true);
    setError("");
    try {
      await verifyAdminComplaint(selectedComplaintId);
      toast.custom(
        <SuccessToast
          title="Complaint verified"
          message="Verification updated successfully"
        />,
      );
      await refreshAll();
    } catch {
      setError("Failed to verify complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  const onUnverify = async () => {
    if (!selectedComplaintId) return;
    setActionLoading(true);
    setError("");
    try {
      await unverifyAdminComplaint(selectedComplaintId);
      toast.custom(
        <SuccessToast
          title="Complaint unverified"
          message="Verification updated successfully"
        />,
      );
      await refreshAll();
    } catch {
      setError("Failed to unverify complaint.");
    } finally {
      setActionLoading(false);
    }
  };

  const onUpdateCategory = async (categoryId) => {
    if (!selectedComplaintId || !categoryId) return;
    setActionLoading(true);
    setError("");
    try {
      await updateAdminComplaintCategory(selectedComplaintId, categoryId);
      toast.custom(
        <SuccessToast
          title="Category updated"
          message="Complaint category updated successfully"
        />,
      );
      await refreshAll();
    } catch {
      setError("Failed to update complaint category.");
    } finally {
      setActionLoading(false);
    }
  };

  const onUpdateStatus = async (statusName) => {
    if (!selectedComplaintId || !statusName) return;
    setActionLoading(true);
    setError("");
    try {
      await updateAdminComplaintStatus(selectedComplaintId, statusName);
      toast.custom(
        <SuccessToast
          title="Status updated"
          message="Complaint status updated successfully"
        />,
      );
      await refreshAll();
    } catch {
      setError("Failed to update complaint status.");
    } finally {
      setActionLoading(false);
    }
  };

  const onDownloadPdf = async () => {
    setPdfLoading(true);
    setError("");
    try {
      const blob = await downloadAdminComplaintsPdf(apiFilters);
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      downloadBlobFile(blob, `complaints-report-${stamp}.pdf`);
      toast.custom(
        <SuccessToast
          title="Report downloaded"
          message="PDF downloaded successfully"
        />,
      );
    } catch {
      setError("Failed to download PDF report.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="mb-4">
          <h1 className="text-2xl text-gray-900">Complaint Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            View and manage complaint verification, status, and category
          </p>
        </div>

        <ComplaintFilterBar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          onDownloadPdf={onDownloadPdf}
          loadingPdf={pdfLoading}
        />

        <ErrorAlert message={error} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ComplaintList
            complaints={complaints}
            selectedComplaintId={selectedComplaintId}
            onSelect={setSelectedComplaintId}
            loading={listLoading}
          />

          <ComplaintDetailsPanel
            complaint={selectedComplaintDetail}
            categories={categories}
            loading={detailLoading}
            actionLoading={actionLoading}
            onVerify={onVerify}
            onUnverify={onUnverify}
            onUpdateCategory={onUpdateCategory}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagementDashboard;
