export const VERIFIED_FILTER = {
  ALL: "all",
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
};

export const DEFAULT_FILTERS = {
  search: "",
  status: "",
  categoryId: "",
  verified: VERIFIED_FILTER.ALL,
};

export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "resolved", label: "Resolved" },
];

export const VERIFIED_FILTER_OPTIONS = [
  { value: VERIFIED_FILTER.ALL, label: "All" },
  { value: VERIFIED_FILTER.VERIFIED, label: "Verified" },
  { value: VERIFIED_FILTER.UNVERIFIED, label: "Unverified" },
];

export const STATUS_UPDATE_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "resolved", label: "Resolved" },
];
