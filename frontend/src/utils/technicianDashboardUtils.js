import {
  NEXT_STATUS,
  STATUS_LABELS,
  PRIORITY_CLASS,
  STATUS_BADGE_CLASS,
  STATUS_ICON,
  ACTION_META,
} from "../constants/technicianDashboardConstants";

export const getNextStatus = (status) => NEXT_STATUS[status] ?? null;

export const formatStatus = (status) =>
  STATUS_LABELS[status] || status?.replaceAll("_", " ");

export const getCounts = (complaints = []) => ({
  all: complaints.length,
  assigned: complaints.filter((c) => c.status === "assigned").length,
  in_progress: complaints.filter((c) => c.status === "in_progress").length,
  completed: complaints.filter((c) => c.status === "completed").length,
  resolved: complaints.filter((c) => c.status === "resolved").length,
});

export const filterComplaints = (complaints, activeTab, searchQuery) => {
  const q = searchQuery.trim().toLowerCase();
  return complaints.filter((c) => {
    const tabOk = activeTab === "all" || c.status === activeTab;
    const searchOk =
      !q ||
      c.title?.toLowerCase().includes(q) ||
      c.complaintId?.toLowerCase().includes(q);
    return tabOk && searchOk;
  });
};

export const getPriorityClass = (priority = "low") =>
  PRIORITY_CLASS[priority] || PRIORITY_CLASS.low;

export const getStatusBadgeMeta = (status) => ({
  className:
    STATUS_BADGE_CLASS[status] || "bg-gray-100 text-gray-600 border-gray-200",
  Icon: STATUS_ICON[status],
  label: formatStatus(status),
});

export const getActionMetaByCurrentStatus = (currentStatus) =>
  ACTION_META[currentStatus] || null;

export const formatShortDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const formatLongDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
