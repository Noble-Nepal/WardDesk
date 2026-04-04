import {
  ClipboardList,
  Clock,
  CheckCircle,
  CheckCircle2,
  Play,
} from "lucide-react";

export const STATUS_ICON = {
  assigned: ClipboardList,
  in_progress: Clock,
  completed: CheckCircle,
  resolved: CheckCircle2,
};

export const STATUS = {
  ALL: "all",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  RESOLVED: "resolved",
};

export const STATUS_TABS = [
  STATUS.ALL,
  STATUS.ASSIGNED,
  STATUS.IN_PROGRESS,
  STATUS.COMPLETED,
  STATUS.RESOLVED,
];

export const STATUS_LABELS = {
  all: "All",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  resolved: "Resolved",
};

export const PRIORITY_CLASS = {
  high: "bg-red-100 text-red-700",
  urgent: "bg-red-100 text-red-700",
  medium: "bg-orange-100 text-orange-700",
  low: "bg-blue-100 text-blue-700",
};

export const STATUS_BADGE_CLASS = {
  assigned: "bg-blue-50 text-[#2B4AA0] border-blue-200",
  in_progress: "bg-orange-50 text-orange-700 border-orange-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  resolved: "bg-green-50 text-green-700 border-green-200", // changed
};

export const ACTION_CLASS = {
  assigned: "bg-[#2B4AA0] hover:bg-[#1d3570] text-white",
  in_progress: "bg-orange-500 hover:bg-orange-600 text-white",
  completed: "bg-emerald-600 hover:bg-emerald-700 text-white",
};

export const ACTION_META = {
  assigned: {
    label: "Start Work",
    className: ACTION_CLASS.assigned,
    Icon: Play,
  },
  in_progress: {
    label: "Mark Completed",
    className: ACTION_CLASS.in_progress,
    Icon: CheckCircle,
  },
  completed: {
    label: "Mark Resolved",
    className: ACTION_CLASS.completed,
    Icon: CheckCircle2,
  },
};

export const NEXT_STATUS = {
  assigned: "in_progress",
  in_progress: "completed",
  completed: "resolved",
  resolved: null,
};
