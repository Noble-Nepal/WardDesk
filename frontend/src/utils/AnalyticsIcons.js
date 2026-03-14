import {
  FileText,
  Clock,
  AlertCircle,
  BarChart3,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export const analyticsIconMap = {
  total: { Icon: FileText, bg: "bg-blue-600" },
  pending: { Icon: Clock, bg: "bg-orange-500" },
  assigned: { Icon: AlertCircle, bg: "bg-blue-400" },
  inProgress: { Icon: BarChart3, bg: "bg-purple-500" },
  resolved: { Icon: CheckCircle, bg: "bg-green-600" },
  avgTime: { Icon: TrendingUp, bg: "bg-indigo-500" },
};
