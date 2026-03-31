import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export function StatusBadge({ status }) {
  const variant = {
    active: {
      class: "bg-green-50 border-green-200 text-green-700",
      icon: <CheckCircle className="w-3 h-3" />,
      text: "Active",
    },
    inactive: {
      class: "bg-gray-50 border-gray-200 text-gray-600",
      icon: <Clock className="w-3 h-3" />,
      text: "Inactive",
    },
    suspended: {
      class: "bg-red-50 border-red-200 text-red-700",
      icon: <AlertCircle className="w-3 h-3" />,
      text: "Suspended",
    },
  }[status];
  if (!variant) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${variant.class}`}
    >
      {variant.icon}
      <span className="capitalize">{variant.text}</span>
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const variant = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    low: "bg-green-50 text-green-700 border-green-200",
  }[priority];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border capitalize ${variant}`}
    >
      {priority}
    </span>
  );
}

export function ComplaintStatusBadge({ status }) {
  const variant = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    resolved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  }[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border capitalize ${variant}`}
    >
      {status.replace("-", " ")}
    </span>
  );
}

export function WardBadge({ ward }) {
  return (
    <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
      {ward}
    </span>
  );
}
