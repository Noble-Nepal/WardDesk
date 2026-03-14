import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DailyTrendChart({ data }) {
  if (!data) return null;
  const chartData = Object.entries(data).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" horizontal stroke="#e5e7eb" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "white",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: 8,
            color: "#111",
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#colorCount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
