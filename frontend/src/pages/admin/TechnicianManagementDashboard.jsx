import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SuccessToast from "../../components/ui/SuccessToast";
import HeaderSection from "../../components/adminTechnicians/HeaderSection";
import StatsOverviewCard from "../../components/adminTechnicians/StatsOverviewCard";
import FilterSearchBar from "../../components/adminTechnicians/FilterSearchBar";
import TechnicianTable from "../../components/adminTechnicians/TechnicianTable";
import TechnicianDetailsModal from "../../components/adminTechnicians/TechnicianDetailsModel";
import AssignComplaintModal from "../../components/adminTechnicians/AssignComplaintModal";
import {
  getPendingTechnicians,
  getAllTechnicians,
  verifyTechnician,
  rejectTechnician,
  getUnassignedComplaints,
  assignComplaint,
} from "../../api/adminTechnicianApi";

export default function TechnicianManagementDashboard() {
  const [tab, setTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState([]);
  const [all, setAll] = useState([]);
  const [stats, setStats] = useState([0, 0, 0, 0]);
  const [loading, setLoading] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  // API load logic
  const loadData = async () => {
    setLoading(true);
    const [pendingTechs, allTechs] = await Promise.all([
      getPendingTechnicians(),
      getAllTechnicians(),
    ]);
    setPending(pendingTechs);
    setAll(allTechs);
    const comps = assignOpen ? complaints : await getUnassignedComplaints();
    setComplaints(comps);
    setStats([
      pendingTechs.length,
      allTechs.filter((t) => t.status === "active").length,
      allTechs.length,
      comps.length,
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const searchFilter = (t) =>
    [t.fullName, t.email, String(t.wardNumber), t.address].some((val) =>
      val?.toLowerCase().includes(search.toLowerCase()),
    );
  const visibleTechs = (tab === "Pending" ? pending : all).filter(searchFilter);

  const handleApprove = async (tech) => {
    try {
      await verifyTechnician(tech.userId || tech.UserId);
      toast.custom(
        (t) => (
          <div className={t.visible ? "animate-enter" : "animate-leave"}>
            <SuccessToast
              title="Technician Approved!"
              message={`${tech.fullName || "Technician"} is now verified.`}
            />
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
      setSelectedTechnician(null);
      await loadData();
    } catch {
      toast.error("Failed to approve technician");
    }
  };

  const handleReject = async (tech) => {
    try {
      await rejectTechnician(tech.userId || tech.UserId);
      toast.custom(
        (t) => (
          <div className={t.visible ? "animate-enter" : "animate-leave"}>
            <SuccessToast
              title="Technician Rejected"
              message={`${tech.fullName || "Technician"} was removed.`}
            />
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
      setSelectedTechnician(null);
      await loadData();
    } catch {
      toast.error("Failed to reject technician");
    }
  };

  const handleOpenAssign = async () => {
    const comps = await getUnassignedComplaints();
    setComplaints(comps);
    setAssignOpen(true);
    setStats((s) => [s[0], s[1], s[2], comps.length]);
  };

  const handleAssign = async (complaint, technician) => {
    try {
      await assignComplaint({
        complaintId: complaint.complaintId,
        technicianId: technician.userId || technician.UserId,
      });
      toast.custom(
        (t) => (
          <div className={t.visible ? "animate-enter" : "animate-leave"}>
            <SuccessToast
              title="Complaint Assigned!"
              message={`Complaint assigned to ${technician.fullName || "Technician"} successfully.`}
            />
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
      await loadData();
    } catch {
      toast.error("Failed to assign complaint");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <HeaderSection onAssign={handleOpenAssign} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <StatsOverviewCard stats={stats} />
        <FilterSearchBar
          tab={tab}
          setTab={setTab}
          tabCounts={[pending.length, all.length]}
          search={search}
          setSearch={setSearch}
        />
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <TechnicianTable
            technicians={visibleTechs}
            onView={setSelectedTechnician}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
      {/* Technician details modal */}
      <TechnicianDetailsModal
        open={!!selectedTechnician}
        technician={selectedTechnician}
        onClose={() => setSelectedTechnician(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      {/* Complaint assignment modal */}
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
