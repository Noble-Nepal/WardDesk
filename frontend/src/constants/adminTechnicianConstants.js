import {
  Clock,
  UserCheck,
  Users,
  ClipboardList,
  CheckCircle,
  XCircle,
  AlertCircle,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

export const BRAND_BLUE = "#2B4AA0";
export const TECH_TABS = ["Pending", "All"];

export const STATS_CARD_CONFIG = [
  { label: "Pending Verification", color: "bg-orange-500", Icon: Clock },
  { label: "Active Technicians", color: "bg-[#2B4AA0]", Icon: UserCheck },
  { label: "Total Technicians", color: "bg-gray-600", Icon: Users },
  { label: "Unassigned Complaints", color: "bg-red-500", Icon: ClipboardList },
];

export const ACCOUNT_STATUS_META = {
  active: {
    label: "Active",
    cls: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Icon: CheckCircle,
  },
  inactive: {
    label: "Inactive",
    cls: "bg-blue-100 text-blue-700 border-blue-200",
    Icon: XCircle,
  },
  pending: {
    label: "Pending",
    cls: "bg-orange-100 text-orange-700 border-orange-200",
    Icon: Clock,
  },
};

export const VERIFICATION_META = {
  verified: {
    label: "Verified",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: ShieldCheck,
  },
  unverified: {
    label: "Unverified",
    cls: "bg-red-50 text-red-700 border-red-200",
    Icon: ShieldX,
  },
};

export const ASSIGNMENT_META = {
  assigned: {
    label: "Assigned",
    cls: "bg-blue-100 text-blue-700 border-blue-200",
    Icon: ClipboardList,
  },
  busy: {
    label: "Busy",
    cls: "bg-amber-100 text-amber-700 border-amber-200",
    Icon: AlertCircle,
  },
  unassigned: {
    label: "Unassigned",
    cls: "bg-gray-100 text-gray-700 border-gray-200",
    Icon: Clock,
  },
};
