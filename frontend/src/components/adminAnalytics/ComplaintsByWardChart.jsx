import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ComplaintsByWardChart({ data }) {
  if (!data) return null;
  const chartData = Object.entries(data)
    .map(([ward, count]) => ({
      ward: "Ward " + ward,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke="#e5e7eb"
        />
        <XAxis type="number" fontSize={12} />
        <YAxis dataKey="ward" type="category" fontSize={12} width={70} />
        <Tooltip
          contentStyle={{
            background: "white",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: 8,
            color: "#111",
          }}
        />
        <Bar dataKey="count" fill="#2B4AA0" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
