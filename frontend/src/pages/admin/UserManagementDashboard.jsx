import { useState, useEffect } from "react";
import StatsOverviewCard from "../../components/userManagement/StatsOverviewCard";
import SearchFilterBar from "../../components/userManagement/SearchFilterBar";
import UserList from "../../components/userManagement/UserList";
import Pagination from "../../components/ui/Pagination";
import UserDetailsModal from "../../components/userManagement/UserDetailsModal";
import EditCitizenModal from "../../components/userManagement/EditCitizenModal";
import DeleteCitizenModal from "../../components/userManagement/DeleteCitizenModal";
import SuccessToast from "../../components/ui/SuccessToast"; // update path as needed
import { fetchCitizens, updateCitizenRole } from "../../api/userApi";
import { getAllComplaints } from "../../api/complaintApi";

// Only used for the Edit modal UI, not for backend calls here
const ROLES = [
  { label: "Citizen", value: "citizen", id: 1 },
  { label: "Technician", value: "technician", id: 2 },
  { label: "Admin", value: "admin", id: 3 },
];

function mapCitizen(u) {
  return {
    id: u.userId,
    name: u.fullName,
    email: u.email,
    phone: u.phoneNumber,
    ward: u.wardNumber,
    address: u.address,
    profilePhoto: u.profilePhotoUrl,
    isActive: u.isActive,
    createdAt: u.createdAt,
    role: u.role,
  };
}

export default function UserManagementDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState([0, 0, 0, 0]);
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const total = users.length;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Modals and editing
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Toast
  const [showSuccess, setShowSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    message: "",
  });

  // Responsive breakpoint
  const [breakpoint, setBreakpoint] = useState(
    typeof window !== "undefined"
      ? window.innerWidth >= 1024
        ? "desktop"
        : window.innerWidth >= 768
          ? "tablet"
          : "mobile"
      : "desktop",
  );
  useEffect(() => {
    function handleResize() {
      setBreakpoint(
        window.innerWidth >= 1024
          ? "desktop"
          : window.innerWidth >= 768
            ? "tablet"
            : "mobile",
      );
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all citizens
  useEffect(() => {
    setLoading(true);
    fetchCitizens()
      .then((response) => {
        const data = Array.isArray(response) ? response : response.data || [];
        const mapped = data.map(mapCitizen);
        setUsers(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch all complaints
  useEffect(() => {
    getAllComplaints().then((response) => {
      const complaintList = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setComplaints(complaintList);
    });
  }, []);

  // Filtering
  useEffect(() => {
    let data = users;
    if (search) {
      const lower = search.toLowerCase();
      data = data.filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(lower)) ||
          (u.email && u.email.toLowerCase().includes(lower)) ||
          (u.phone && u.phone.toLowerCase().includes(lower)) ||
          (u.address && u.address.toLowerCase().includes(lower)) ||
          (u.ward && String(u.ward).includes(lower)),
      );
    }
    if (ward) {
      data = data.filter((u) => String(u.ward) === String(ward));
    }
    if (status) {
      if (status === "active") data = data.filter((u) => u.isActive);
      else if (status === "inactive") data = data.filter((u) => !u.isActive);
    }
    setFilteredUsers(data);
    setPage(1);
    setStats([data.length, data.filter((u) => u.isActive).length, 0, 0]);
  }, [search, ward, status, users]);

  // Paging
  const pagedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // Modal open/close and actions
  function openView(citizen) {
    const citizenComplaints = complaints.filter(
      (c) => c.citizenId === citizen.id || c.citizenId === citizen.userId,
    );
    setSelectedCitizen({
      ...citizen,
      complaints: citizenComplaints,
    });
    setShowDetailsModal(true);
    setShowEditModal(false);
    setShowDeleteModal(false);
  }

  function openEdit(citizen) {
    setSelectedCitizen(citizen);
    setEditForm({ role: citizen.role });
    setShowEditModal(true);
    setShowDetailsModal(false);
    setShowDeleteModal(false);
  }

  function handleEditSave(roleObj) {
    setEditLoading(true);
    updateCitizenRole(selectedCitizen.id, roleObj.id)
      .then(() => {
        setShowEditModal(false);
        setSelectedCitizen(null);
        setEditLoading(false);
        setToastMessage({
          title: "Role Updated!",
          message: "Citizen role has been changed successfully.",
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      })
      .catch(() => {
        setEditLoading(false);
        alert("Failed to update role.");
      });
  }

  function openDelete(citizen) {
    setSelectedCitizen(citizen);
    setShowDeleteModal(true);
    setShowDetailsModal(false);
    setShowEditModal(false);
  }
  function handleDeleteConfirm() {
    setUsers((us) => us.filter((u) => u.id !== selectedCitizen.id));
    setShowDeleteModal(false);
    setSelectedCitizen(null);
  }

  return (
    <div className="DashboardLayout">
      {/* Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-150">
          <SuccessToast
            title={toastMessage.title}
            message={toastMessage.message}
          />
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-center sm:justify-between">
        <div className="w-full">
          <h1 className="text-2xl sm:text-3xl text-gray-900 mb-1 sm:mb-2 font-bold">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View, search, edit, and manage all registered citizens
          </p>
        </div>
        <span className="mt-2 sm:mt-0 sm:ml-4 text-sm text-gray-500">
          {filteredUsers.length} of {total} users
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <StatsOverviewCard stats={stats} />
        <SearchFilterBar
          search={search}
          setSearch={setSearch}
          ward={ward}
          setWard={setWard}
          status={status}
          setStatus={setStatus}
          filteredCount={filteredUsers.length}
          totalCount={total}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 text-center text-gray-500">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-16 text-center">
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5m2-4v-4a4 4 0 118 0v4M7 10a4 4 0 018 0"
                />
              </svg>
              <div className="text-gray-500 text-sm">
                No citizens found matching your criteria
              </div>
              <div className="text-gray-400 text-xs mt-1">
                Try adjusting your search or filters
              </div>
            </div>
          </div>
        ) : (
          <UserList
            users={pagedUsers}
            breakpoint={breakpoint}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          from={1 + (page - 1) * PAGE_SIZE}
          to={Math.min(page * PAGE_SIZE, filteredUsers.length)}
          total={filteredUsers.length}
        />
      </div>
      <UserDetailsModal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        citizen={selectedCitizen}
        onEditProfile={openEdit}
      />
      <EditCitizenModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        citizen={selectedCitizen}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleEditSave}
        loading={editLoading}
      />
      <DeleteCitizenModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        citizen={selectedCitizen}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
