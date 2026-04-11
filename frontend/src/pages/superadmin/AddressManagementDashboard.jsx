import { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Loader2, Hash } from "lucide-react";
import { getWardAreas, addWardArea, deleteWardArea } from "../../api/wardApi";
import ErrorAlert from "../../components/ui/ErrorAlert";

const EMPTY_FORM = { addressName: "", wardFrom: "", wardTo: "" };

export default function AddressManagementDashboard() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  // Add form
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [adding, setAdding] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState(null);

  const loadAreas = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await getWardAreas();
      setAreas(Array.isArray(res.data) ? res.data : []);
    } catch {
      setPageError("Failed to load addresses. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAreas(); }, []);

  const validateForm = () => {
    const errs = {};
    if (!form.addressName.trim()) errs.addressName = "Address name is required.";
    const from = parseInt(form.wardFrom, 10);
    const to = parseInt(form.wardTo, 10);
    if (!form.wardFrom || isNaN(from) || from < 1) errs.wardFrom = "Enter a valid start ward (≥ 1).";
    if (!form.wardTo || isNaN(to) || to < from) errs.wardTo = "End ward must be ≥ start ward.";
    return errs;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    setAdding(true);
    setFormErrors({});
    setPageError("");
    try {
      await addWardArea(form.addressName.trim(), parseInt(form.wardFrom, 10), parseInt(form.wardTo, 10));
      setForm(EMPTY_FORM);
      await loadAreas();
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to add address.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (wardAreaId) => {
    setDeletingId(wardAreaId);
    setPageError("");
    try {
      await deleteWardArea(wardAreaId);
      await loadAreas();
    } catch (err) {
      setPageError(err?.response?.data?.message || "Failed to delete address.");
    } finally {
      setDeletingId(null);
    }
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Address Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Add localities with their ward number range. These will appear as options when users register or report issues.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <ErrorAlert message={pageError} />

        {/* ── Add Address Card ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Add New Address</h2>
            <p className="text-xs text-gray-500 mt-0.5">Enter the locality name and the ward number range it covers</p>
          </div>
          <form onSubmit={handleAdd} className="px-5 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Address Name */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Address / Locality Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shantinagar"
                  value={form.addressName}
                  onChange={(e) => setField("addressName", e.target.value)}
                  className={`w-full h-9 px-3 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] ${formErrors.addressName ? "border-red-400" : "border-gray-300"}`}
                />
                {formErrors.addressName && <p className="text-red-500 text-xs mt-1">{formErrors.addressName}</p>}
              </div>

              {/* Ward From */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ward From</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 1"
                  value={form.wardFrom}
                  onChange={(e) => setField("wardFrom", e.target.value)}
                  className={`w-full h-9 px-3 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] ${formErrors.wardFrom ? "border-red-400" : "border-gray-300"}`}
                />
                {formErrors.wardFrom && <p className="text-red-500 text-xs mt-1">{formErrors.wardFrom}</p>}
              </div>

              {/* Ward To */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ward To</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 5"
                  value={form.wardTo}
                  onChange={(e) => setField("wardTo", e.target.value)}
                  className={`w-full h-9 px-3 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2B4AA0] ${formErrors.wardTo ? "border-red-400" : "border-gray-300"}`}
                />
                {formErrors.wardTo && <p className="text-red-500 text-xs mt-1">{formErrors.wardTo}</p>}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={adding}
                className="h-9 px-5 bg-[#2B4AA0] hover:bg-[#1d3570] text-white rounded-lg text-sm inline-flex items-center gap-2 disabled:opacity-50"
              >
                {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add Address
              </button>
            </div>
          </form>
        </div>

        {/* ── Address List ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Configured Addresses</h2>
              <p className="text-xs text-gray-500 mt-0.5">{areas.length} address{areas.length !== 1 ? "es" : ""} available</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
          ) : areas.length === 0 ? (
            <div className="py-12 text-center">
              <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No addresses added yet. Use the form above to add one.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Address / Locality</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Ward Range</th>
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">No. of Wards</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((a) => (
                  <tr key={a.wardAreaId} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{a.addressName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          Ward {a.wardFrom} — Ward {a.wardTo}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#2B4AA0] border border-blue-100">
                        {a.wardTo - a.wardFrom + 1} ward{a.wardTo - a.wardFrom + 1 !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(a.wardAreaId)}
                        disabled={deletingId === a.wardAreaId}
                        className="inline-flex items-center gap-1.5 h-8 px-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-xs disabled:opacity-40 transition-colors"
                      >
                        {deletingId === a.wardAreaId
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
