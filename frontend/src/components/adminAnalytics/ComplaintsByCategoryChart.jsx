import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function ComplaintsByCategoryChart({ data }) {
  if (!data) return null;
  const chartData = Object.entries(data).map(([category, count], idx) => ({
    category,
    count,
    fill: ["#2563eb", "#ea580c", "#10b981", "#8b5cf6", "#14b8a6", "#facc15"][
      idx % 6
    ],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e5e7eb"
        />
        <XAxis
          dataKey="category"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
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
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
