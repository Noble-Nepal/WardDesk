import { ChevronLeft, ChevronRight } from "lucide-react";
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  from,
  to,
  total,
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing {from}-{to} of {total}
      </div>
      <div className="flex gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={`p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 ${page === 1 ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-md text-sm border ${page === p ? "bg-blue-500 text-white border-blue-500" : "text-gray-600 hover:bg-gray-50 border-gray-200"}`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 ${page === totalPages ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
