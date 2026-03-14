export default function HeaderSection({ title, subtitle, right }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 sm:py-6">
        <div>
          <h1 className="text-2xl sm:text-3xl text-gray-900 font-bold">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>
        </div>
        {right && (
          <div className="flex items-center space-x-2 mt-3 sm:mt-0">
            {right}
          </div>
        )}
      </div>
    </div>
  );
}
