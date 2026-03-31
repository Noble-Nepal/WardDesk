import { Eye, Edit3, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export function UserTableActions({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        className="p-1.5 rounded-md text-gray-400 transition-colors hover:text-blue-600 hover:bg-blue-50"
        type="button"
        title="View Details"
        onClick={onView}
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        className="p-1.5 rounded-md text-gray-400 transition-colors hover:text-blue-600 hover:bg-blue-50"
        type="button"
        title="Edit"
        onClick={onEdit}
      >
        <Edit3 className="w-4 h-4" />
      </button>
      <button
        className="p-1.5 rounded-md text-gray-400 transition-colors hover:text-red-600 hover:bg-red-50"
        type="button"
        title="Delete"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
export function UserCardActions({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
        onClick={onView}
      >
        <Eye className="w-3.5 h-3.5 mr-1" />
        View
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
        onClick={onEdit}
      >
        <Edit3 className="w-3.5 h-3.5 mr-1" />
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="border-red-200 text-red-600 hover:bg-red-50 px-2.5 flex items-center justify-center"
        onClick={onDelete}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
