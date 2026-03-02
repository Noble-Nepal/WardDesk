import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import NepalMapPicker from "../../components/map/mapPicker";
import PhotoUploader from "../../components/reportIssue/PhotoUploader";
import ImpactStatsCard from "../../components/reportIssue/ImpactStatsCard";
import handleImageUpload from "../../utils/handleImageUpload";
import {
  WARD_OPTIONS,
  PRIORITY_OPTIONS,
  MAX_PHOTOS,
  MAX_TOTAL_SIZE,
  DESCRIPTION_MAX_LENGTH,
  DEFAULT_PRIORITY,
  REPORT_TIPS,
  VALIDATION_MESSAGES,
  TOAST_CONFIG,
  LABELS,
  PLACEHOLDERS,
} from "../../constants/reportIssueConstants";
import {
  createComplaint,
  getComplaintCategories,
  getImpactStats,
} from "../../api/complaintApi";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import SuccessToast from "../../components/ui/SuccessToast";

export default function ReportIssue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const citizenId = user?.userId;

  // Form state
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [ward, setWard] = useState("");
  const [latlng, setLatLng] = useState(null);
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [priority, setPriority] = useState("low");
  const [emailUpdates, setEmailUpdates] = useState(true);

  // Impact stats state
  const [impactStats, setImpactStats] = useState({
    filed: 0,
    resolved: 0,
    message: "",
  });

  // Error/loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const descCount = description.length;

  // Fetch categories from API on mount
  useEffect(() => {
    setCategoriesLoading(true);
    getComplaintCategories()
      .then((res) => {
        setCategories(res.data);
      })
      .catch(() => setError("Failed to load categories."))
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    if (citizenId) {
      getImpactStats(citizenId).then((res) => setImpactStats(res.data));
    }
  }, [citizenId]);

  // Quick category selection (set as ID)
  const handleCategoryButton = (catId) => setCategoryId(catId);

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !categoryId || !description || !ward || !latlng) {
      setError(
        "Please fill all required fields and pick a location on the map.",
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const photoUrls = await Promise.all(
        photos.map((file) => handleImageUpload(file)),
      );
      const payload = {
        title,
        categoryId: Number(categoryId),
        description,
        latitude: latlng[0],
        longitude: latlng[1],
        wardNumber: Number(ward), // <-- Use Number(ward) here
        locationAddress: address,
        photoUrls,
        priorityLevel: priority,
        emailUpdates,
      };
      await createComplaint(payload);

      // Show the SuccessToast
      toast.custom(
        (t) => (
          <div className={t.visible ? "animate-enter" : "animate-leave"}>
            <SuccessToast
              title="Report Submitted!"
              message="Your issue has been successfully filed."
            />
          </div>
        ),
        {
          duration: 4000,
          style: {
            padding: "0",
            background: "transparent",
            boxShadow: "none",
          },
        },
      );

      setTimeout(() => {
        navigate("citizen/dashboard");
      }, 1000);
    } catch {
      setError("Failed to submit issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{LABELS.pageTitle}</h1>
            <div className="text-gray-600">{LABELS.pageSubtitle}</div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center px-4 py-2 border rounded-lg text-sm bg-white hover:bg-slate-50 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {LABELS.backToDashboard}
          </button>
        </div>
      </div>

      {/* PAGE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* MAIN FORM */}
        <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6 pb-3 border-b-2 border-red-500 w-full">
              <h2 className="text-xl text-gray-900">{LABELS.basicInfo}</h2>
            </div>
            <div className="space-y-4">
              {/* Issue Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-3 border rounded-lg text-sm"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm"
                  disabled={categoriesLoading}
                >
                  <option value="" disabled>
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select issue category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {categories.length > 0 && (
                  <div className="flex gap-2 mt-2 text-xs flex-wrap items-center">
                    <span className="text-gray-500">Common categories:</span>
                    {categories.map((cat) => (
                      <button
                        key={cat.categoryId}
                        type="button"
                        className={`px-3 py-1 rounded-full border ${
                          cat.categoryId === categoryId
                            ? "bg-red-100 border-red-400 text-red-700"
                            : "bg-slate-100 border-gray-200 text-slate-700"
                        } hover:bg-slate-200 transition-colors`}
                        onClick={() => handleCategoryButton(cat.categoryId)}
                      >
                        {cat.categoryName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  placeholder="Provide detailed information about the issue"
                  className="w-full px-4 py-3 min-h-32 border rounded-lg text-sm"
                  maxLength={500}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {descCount} / 500
                </div>
              </div>
            </div>
          </div>
          {/* Location Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6">
              {LABELS.locationInfo}
            </h2>
            <div className="space-y-4">
              {/* Ward Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Ward Number *
                </label>
                <select
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm"
                >
                  <option value="" disabled>
                    Select ward
                  </option>
                  {WARD_OPTIONS.map((w) => (
                    <option key={w} value={w}>
                      Ward {w}
                    </option>
                  ))}
                </select>
              </div>
              {/* Map Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Pick Location on Map *
                </label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <NepalMapPicker value={latlng} onChange={setLatLng} />
                  <div className="text-gray-500 text-sm text-center mt-2">
                    {latlng
                      ? `Selected: (${latlng[0].toFixed(6)}, ${latlng[1].toFixed(6)})`
                      : "Click on the map to select location"}
                  </div>
                </div>
              </div>
              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  placeholder="Address and nearby landmarks"
                  className="w-full px-4 py-3 border rounded-lg text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Upload Photos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-2">
              {LABELS.uploadPhotos}
            </h2>
            <div className="text-sm text-gray-600 mb-6">
              Upload up to 3 images (Max total size: 15MB)
            </div>
            <PhotoUploader
              photos={photos}
              setPhotos={setPhotos}
              error={error}
              setError={setError}
              MAX_PHOTOS={MAX_PHOTOS}
              MAX_TOTAL_SIZE={MAX_TOTAL_SIZE}
            />
          </div>
          {/* Priority Level */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-2">
              {LABELS.priorityLevel}
            </h2>
            <div className="text-sm text-gray-600 mb-6">
              Select the urgency level for this issue
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PRIORITY_OPTIONS.map((opt) => {
                const isSelected = priority === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => setPriority(opt.value)}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 ${isSelected ? opt.selectedClass : "border-gray-200"} hover:border-gray-300 transition-all cursor-pointer`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      checked={isSelected}
                      onChange={() => setPriority(opt.value)}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div className="flex-1">
                      <label className="cursor-pointer flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${opt.dot}`}
                        ></span>
                        {opt.label}
                      </label>
                      <div className="text-xs text-gray-500 mt-1">
                        {opt.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Contact Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6">
              {LABELS.contactPreferences}
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <span>Send me email updates about this issue</span>
              </label>
            </div>
          </div>
          {/* Form Actions */}
          <div className="border-t border-gray-200 bg-white rounded-lg shadow-sm p-6 flex gap-4 justify-end">
            <button
              type="button"
              className="px-8 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
              onClick={() => navigate("/dashboard")}
            >
              {LABELS.cancel}
            </button>
            <button
              type="submit"
              className={`px-8 py-2 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-600 shadow-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {LABELS.submit}
            </button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
        {/* SIDEBAR */}
        <aside className="lg:col-span-1 sticky top-24 space-y-6">
          {/* Tips Card */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h3 className="text-lg text-gray-900 mb-4">{LABELS.tipsHeader}</h3>
            <div className="space-y-3 text-sm text-gray-700">
              {REPORT_TIPS.map((tip, idx) => (
                <div className="flex gap-2" key={idx}>
                  <span className="text-blue-600 font-semibold">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Impact Stats Card */}
          <ImpactStatsCard
            filed={impactStats.filed}
            resolved={impactStats.resolved}
            message={impactStats.message}
            header={LABELS.impactHeader}
          />
        </aside>
      </div>
    </div>
  );
}
