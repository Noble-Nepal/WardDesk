import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  STATUS_FILTER_OPTIONS,
  VERIFIED_FILTER_OPTIONS,
} from "../../constants/adminComplaintManagementConstants";

const ComplaintFilterBar = ({
  filters,
  setFilters,
  categories,
  onClear,
  onDownloadPdf,
  loadingPdf,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={filters.search}
            onChange={(e) =>
              setFilters((p) => ({ ...p, search: e.target.value }))
            }
            className="pl-10 h-11"
            placeholder="Search by title, tracking ID, or address"
          />
        </div>

        <select
          className="lg:col-span-2 h-11 border border-gray-300 rounded-md px-3 text-sm bg-white"
          value={filters.status}
          onChange={(e) =>
            setFilters((p) => ({ ...p, status: e.target.value }))
          }
        >
          {STATUS_FILTER_OPTIONS.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          className="lg:col-span-2 h-11 border border-gray-300 rounded-md px-3 text-sm bg-white"
          value={filters.categoryId}
          onChange={(e) =>
            setFilters((p) => ({ ...p, categoryId: e.target.value }))
          }
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <select
          className="lg:col-span-2 h-11 border border-gray-300 rounded-md px-3 text-sm bg-white"
          value={filters.verified}
          onChange={(e) =>
            setFilters((p) => ({ ...p, verified: e.target.value }))
          }
        >
          {VERIFIED_FILTER_OPTIONS.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>

        <div className="lg:col-span-2 flex gap-2">
          <Button variant="outline" className="w-full" onClick={onClear}>
            Clear
          </Button>
          <Button
            className="w-full bg-[#2B4AA0] hover:bg-[#1f3778]"
            onClick={onDownloadPdf}
            disabled={loadingPdf}
          >
            {loadingPdf ? "..." : "PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintFilterBar;
