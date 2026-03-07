// Category filter tabs
export const CATEGORY_FILTERS = [
  { key: "all", label: "All Issues" },
  { key: "Roads", label: "Roads" },
  { key: "Water", label: "Water" },
  { key: "Electricity", label: "Electricity" },
  { key: "Sewerage", label: "Sewerage" },
];

// Category badge colors (maps categoryName → tailwind classes)
export const CATEGORY_BADGE_STYLES = {
  Roads: "bg-yellow-100 text-yellow-700",
  Water: "bg-blue-100 text-blue-700",
  Electricity: "bg-orange-100 text-orange-700",
  Sewerage: "bg-green-100 text-green-700",
};

export const getCategoryBadgeClass = (category) =>
  CATEGORY_BADGE_STYLES[category] || "bg-gray-100 text-gray-700";

// Status badge colors
export const STATUS_BADGE_STYLES = {
  pending: "bg-red-100 text-red-700",
  "in progress": "bg-blue-100 text-blue-700",
  "work in progress": "bg-purple-100 text-purple-700",
  "open issue": "bg-red-100 text-red-700",
  assigned: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  closed: "bg-gray-100 text-gray-700",
};

export const getStatusBadgeClass = (status) =>
  STATUS_BADGE_STYLES[status?.toLowerCase()] || "bg-gray-100 text-gray-700";

export const getStatusLabel = (status) => {
  const labels = {
    pending: "Open Issue",
    "in progress": "In Progress",
    assigned: "Work In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
    closed: "Closed",
  };
  return labels[status?.toLowerCase()] || status || "Unknown";
};

// How many items to show initially / per load-more
export const ITEMS_PER_PAGE = 5;
