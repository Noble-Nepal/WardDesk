import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

import HeaderSection from "../../components/adminTechnicians/HeaderSection";
import StatsOverviewCard from "../../components/adminTechnicians/StatsOverviewCard";
import FilterSearchBar from "../../components/adminTechnicians/FilterSearchBar";
import TechnicianTable from "../../components/adminTechnicians/TechnicianTable";
import TechnicianDetailsModal from "../../components/adminTechnicians/TechnicianDetailsModel";
import AssignComplaintModal from "../../components/adminTechnicians/AssignComplaintModal";
import SuccessToast from "../../components/ui/SuccessToast";
import ErrorAlert from "../../components/ui/ErrorAlert";

import {
  getPendingTechnicians,
  getAllTechnicians,
  verifyTechnician,
  rejectTechnician,
  updateTechnicianAccountStatus, // NEW: make sure this exists in api file
  getUnassignedComplaints,
  assignComplaint,
} from "../../api/adminTechnicianApi";

export default function TechnicianManagementDashboard() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState([]);
  const [all, setAll] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [pageError, setPageError] = useState("");

  const showSuccessToast = (title, message) => {
    toast.custom(
      (t) => (
        <div className={t.visible ? "animate-enter" : "animate-leave"}>
          <SuccessToast title={title} message={message} />
        </div>
      ),
      {
        duration: 3500,
        style: {
          padding: "0",
          background: "transparent",
          boxShadow: "none",
        },
      },
    );
  };

  const loadData = async () => {
    setLoading(true);
    setPageError("");
    try {
      const [pendingTechs, allTechs, unassigned] = await Promise.all([
        getPendingTechnicians(),
        getAllTechnicians(),
        getUnassignedComplaints(),
      ]);

      setPending(Array.isArray(pendingTechs) ? pendingTechs : []);
      setAll(Array.isArray(allTechs) ? allTechs : []);
      setComplaints(Array.isArray(unassigned) ? unassigned : []);
    } catch (err) {
      console.error("Failed to load technician data:", err);
      setPageError(
        "Failed to load technician data. Please refresh and try again.",
      );
      setPending([]);
      setAll([]);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const activeCount = all.filter((t) => t?.isActive).length;
    return [pending.length, activeCount, all.length, complaints.length];
  }, [pending, all, complaints]);

  const visibleTechs = useMemo(() => {
    const base = tab === "Pending" ? pending : all;
    const q = search.trim().toLowerCase();
    if (!q) return base;

    return base.filter((t) =>
      [t?.fullName, t?.email, String(t?.wardNumber ?? ""), t?.address]
        .map((v) => String(v ?? "").toLowerCase())
        .some((v) => v.includes(q)),
    );
  }, [tab, pending, all, search]);

  // Modal handles loading/success/error; parent just performs actions
  const handleApprove = async (tech) => {
    const userId = tech?.userId || tech?.UserId;
    if (!userId) throw new Error("Invalid technician id");

    await verifyTechnician(userId);
    await loadData();
  };

  const handleReject = async (tech) => {
    const userId = tech?.userId || tech?.UserId;
    if (!userId) throw new Error("Invalid technician id");

    await rejectTechnician(userId);
    await loadData();
  };

  const handleUpdateAccountStatus = async (tech, isActive) => {
    const userId = tech?.userId || tech?.UserId;
    if (!userId) throw new Error("Invalid technician id");

    // reason optional; backend usually supports nullable reason
    await updateTechnicianAccountStatus(userId, isActive, "");
    await loadData();
  };

  const handleAssign = async (complaint, technician) => {
    try {
      await assignComplaint({
        complaintId: complaint?.complaintId,
        technicianId: technician?.userId || technician?.UserId,
      });

      showSuccessToast(
        "Complaint Assigned",
        `Task assignment email sent to ${technician?.email || "technician"} in their Gmail.`,
      );

      await loadData();
    } catch (err) {
      console.error("Assign failed:", err);
      setPageError("Failed to assign complaint. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <HeaderSection onAssign={() => setAssignOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <ErrorAlert message={pageError} />

        <StatsOverviewCard stats={stats} />

        <FilterSearchBar
          tab={tab}
          setTab={setTab}
          tabCounts={[all.length, pending.length]}
          search={search}
          setSearch={setSearch}
        />

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <TechnicianTable
            technicians={visibleTechs}
            onView={setSelectedTechnician}
          />
        )}
      </div>

      <TechnicianDetailsModal
        open={!!selectedTechnician}
        technician={selectedTechnician}
        onClose={() => setSelectedTechnician(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onUpdateAccountStatus={handleUpdateAccountStatus} // NEW
      />

      <AssignComplaintModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        unassignedComplaints={complaints}
        technicians={all}
        handleAssign={handleAssign}
      />
    </div>
  );
}
