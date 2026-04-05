export default function AnalyticsChartCard({ title, description, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 w-full">
      <div className="mb-4 pb-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
