import { VERIFIED_FILTER } from "../constants/adminComplaintManagementConstants";

export const normalizeStatus = (status = "") =>
  String(status).trim().toLowerCase().replace(/\s+/g, "_");

export const formatStatus = (status = "") => {
  const s = normalizeStatus(status);
  if (!s) return "Unknown";
  return s
    .split("_")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");
};

export const getStatusClass = (status = "") => {
  const s = normalizeStatus(status);
  if (s === "resolved") return "bg-green-50 text-green-700 border-green-200";
  if (s === "completed")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "in_progress")
    return "bg-orange-50 text-orange-700 border-orange-200";
  if (s === "assigned") return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

export const getPriorityClass = (priority = "") => {
  const p = String(priority).toLowerCase();
  if (p.includes("urgent")) return "bg-red-100 text-red-700";
  if (p.includes("high")) return "bg-orange-100 text-orange-700";
  if (p.includes("medium")) return "bg-yellow-100 text-yellow-700";
  return "bg-blue-100 text-blue-700";
};

export const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const buildComplaintFiltersForApi = (filters) => {
  const out = {
    search: filters.search?.trim() || "",
    status: filters.status || "",
    categoryId: filters.categoryId || "",
  };

  if (filters.verified === VERIFIED_FILTER.VERIFIED) out.isVerified = true;
  if (filters.verified === VERIFIED_FILTER.UNVERIFIED) out.isVerified = false;

  return out;
};

export const downloadBlobFile = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
