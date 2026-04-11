// Category badge colors — keyed by actual DB category names
export const CATEGORY_BADGE_STYLES = {
  "Road Damage":   "bg-amber-100 text-amber-700 border-amber-200",
  "Water Supply":  "bg-blue-100 text-blue-700 border-blue-200",
  "Electricity":   "bg-orange-100 text-orange-700 border-orange-200",
  "Sanitation":    "bg-green-100 text-green-700 border-green-200",
  "Public Safety": "bg-red-100 text-red-700 border-red-200",
  "Other":         "bg-gray-100 text-gray-600 border-gray-200",
};

// Left-border accent colors per category for cards
export const CATEGORY_ACCENT = {
  "Road Damage":   "border-l-amber-400",
  "Water Supply":  "border-l-blue-400",
  "Electricity":   "border-l-orange-400",
  "Sanitation":    "border-l-green-400",
  "Public Safety": "border-l-red-400",
  "Other":         "border-l-gray-300",
};

export const getCategoryBadgeClass = (category) =>
  CATEGORY_BADGE_STYLES[category] || "bg-gray-100 text-gray-600 border-gray-200";

export const getCategoryAccent = (category) =>
  CATEGORY_ACCENT[category] || "border-l-gray-300";

// Status badge colors
export const STATUS_BADGE_STYLES = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  assigned:   "bg-blue-50 text-blue-700 border-blue-200",
  "in progress": "bg-purple-50 text-purple-700 border-purple-200",
  resolved:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected:   "bg-red-50 text-red-700 border-red-200",
  closed:     "bg-gray-50 text-gray-500 border-gray-200",
};

export const getStatusBadgeClass = (status) =>
  STATUS_BADGE_STYLES[status?.toLowerCase()] || "bg-gray-50 text-gray-500 border-gray-200";

export const getStatusLabel = (status) => {
  const labels = {
    pending:       "Pending Review",
    assigned:      "Assigned",
    "in progress": "In Progress",
    resolved:      "Resolved",
    rejected:      "Rejected",
    closed:        "Closed",
  };
  return labels[status?.toLowerCase()] || status || "Unknown";
};

// Priority badge styles
export const PRIORITY_BADGE_STYLES = {
  low:    "bg-slate-100 text-slate-600 border-slate-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  high:   "bg-orange-50 text-orange-700 border-orange-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
};

export const getPriorityBadgeClass = (priority) =>
  PRIORITY_BADGE_STYLES[priority?.toLowerCase()] || "bg-slate-100 text-slate-600 border-slate-200";

// How many items to show initially / per load-more
export const ITEMS_PER_PAGE = 6;
