export default function AnalyticsChartCard({ title, description, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6 w-full">
      <div className="mb-5">
        <div className="text-lg text-gray-900 font-medium">{title}</div>
        <div className="text-sm text-gray-500 mt-1">{description}</div>
      </div>
      <div className="h-75 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
