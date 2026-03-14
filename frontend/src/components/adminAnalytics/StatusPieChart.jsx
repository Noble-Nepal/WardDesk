import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const STATUS_COLORS = {
  Pending: "#ea580c",
  Assigned: "#2563eb",
  "In Progress": "#8b5cf6",
  Resolved: "#10b981",
};

export default function StatusPieChart({ data }) {
  if (!data) return null;
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value, percent }) =>
            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
          }
          labelLine={false}
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={STATUS_COLORS[entry.name] || "#d1d5db"}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "white",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: 8,
            color: "#111",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
