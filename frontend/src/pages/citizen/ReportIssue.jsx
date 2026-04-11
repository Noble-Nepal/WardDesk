import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";
import NepalMapPicker from "../../components/map/mapPicker";
import PhotoUploader from "../../components/reportIssue/PhotoUploader";
import ImpactStatsCard from "../../components/reportIssue/ImpactStatsCard";
import SuccessToast from "../../components/ui/SuccessToast";
import ComplaintDetails from "../../components/complaint/complaintDetails/ComplaintDetails";

import handleImageUpload from "../../utils/handleImageUpload";
import {
  createComplaint,
  getComplaintCategories,
  getImpactStats,
} from "../../api/complaintApi";
import {
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
import { getWardAreas } from "../../api/wardApi";

export default function ReportIssue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const citizenId = user?.userId;

  // ─── Form State ───
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [ward, setWard] = useState("");
  const [latlng, setLatLng] = useState(null);
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  const [emailUpdates, setEmailUpdates] = useState(true);

  // map re-mount guard
  const [mapKey, setMapKey] = useState(0);

  // ─── UI State ───
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // ─── Wards ───
  const [wards, setWards] = useState([]);
  useEffect(() => {
    getWardAreas().then((res) => setWards(Array.isArray(res.data) ? res.data : [])).catch(() => setWards([]));
  }, []);

  // ─── Impact Stats ───
  const [impactStats, setImpactStats] = useState({
    filed: 0,
    resolved: 0,
    message: "",
  });

  useEffect(() => {
    setCategoriesLoading(true);
    getComplaintCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setError(VALIDATION_MESSAGES.categoryError))
      .finally(() => setCategoriesLoading(false));
  }, []);

  useEffect(() => {
    if (citizenId) {
      getImpactStats(citizenId)
        .then((res) => setImpactStats(res.data))
        .catch(() => {});
    }
  }, [citizenId]);

  // hard map cleanup when modal opens
  useEffect(() => {
    if (submittedComplaint) {
      setMapKey((k) => k + 1);
    }
  }, [submittedComplaint]);

  const resetForm = () => {
    setTitle("");
    setCategoryId("");
    setDescription("");
    setWard("");
    setLatLng(null);
    setAddress("");
    setPhotos([]);
    setPriority(DEFAULT_PRIORITY);
    setEmailUpdates(true);
    setError("");
    setSubmittedComplaint(null);
    setMapKey((k) => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !categoryId || !description || !ward || !latlng) {
      setError(VALIDATION_MESSAGES.requiredFields);
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
        wardNumber: Number(ward),
        locationAddress: address,
        photoUrls,
        priorityLevel: priority,
        emailUpdates,
      };

      const response = await createComplaint(payload);

      // clear map first
      setLatLng(null);
      setMapKey((k) => k + 1);

      // then open success modal
      setTimeout(() => {
        setSubmittedComplaint(response.data);
      }, 0);

      toast.custom(
        (t) => (
          <div className={t.visible ? "animate-enter" : "animate-leave"}>
            <SuccessToast
              title={TOAST_CONFIG.title}
              message={TOAST_CONFIG.message}
            />
          </div>
        ),
        { duration: TOAST_CONFIG.duration, style: TOAST_CONFIG.style },
      );
    } catch {
      setError(VALIDATION_MESSAGES.submitError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">{LABELS.pageTitle}</h1>
            <div className="text-gray-600">{LABELS.pageSubtitle}</div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/citizen/dashboard")}
            className="flex items-center px-4 py-2 border rounded-lg text-sm bg-white hover:bg-slate-50 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {LABELS.backToDashboard}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6 pb-3 border-b-2 border-red-500 w-full">
              <h2 className="text-xl text-gray-900">{LABELS.basicInfo}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  placeholder={PLACEHOLDERS.title}
                  className="w-full px-4 py-3 border rounded-lg text-sm"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

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
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Description *
                </label>
                <textarea
                  placeholder={PLACEHOLDERS.description}
                  className="w-full px-4 py-3 min-h-32 border rounded-lg text-sm"
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl text-gray-900 mb-6">
              {LABELS.locationInfo}
            </h2>
            <div className="space-y-4">
              {/* Address — pick locality first */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Address *
                </label>
                <select
                  required
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setWard(""); }}
                  className="w-full px-4 py-3 border rounded-lg text-sm"
                >
                  <option value="" disabled>Select address</option>
                  {wards.map((a) => (
                    <option key={a.wardAreaId} value={a.addressName}>
                      {a.addressName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward Number — range from selected address */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Ward Number *
                </label>
                {(() => {
                  const selected = wards.find((a) => a.addressName === address);
                  const wardOptions = selected
                    ? Array.from({ length: selected.wardTo - selected.wardFrom + 1 }, (_, i) => selected.wardFrom + i)
                    : [];
                  return (
                    <select
                      required
                      value={ward}
                      disabled={!address || wardOptions.length === 0}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="" disabled>{address ? "Select ward number" : "Select address first"}</option>
                      {wardOptions.map((w) => (
                        <option key={w} value={w}>Ward {w}</option>
                      ))}
                    </select>
                  );
                })()}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Pick Location on Map *
                </label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  {!submittedComplaint ? (
                    <NepalMapPicker
                      key={mapKey}
                      value={latlng}
                      onChange={setLatLng}
                    />
                  ) : (
                    <div className="h-75" />
                  )}
                  <div className="text-gray-500 text-sm text-center mt-2">
                    {latlng
                      ? `Selected: (${latlng[0].toFixed(6)}, ${latlng[1].toFixed(6)})`
                      : "Click on the map to select location"}
                  </div>
                </div>
              </div>
            </div>
          </div>

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

          <div className="border-t border-gray-200 bg-white rounded-lg shadow-sm p-6 flex gap-4 justify-end">
            <button
              type="button"
              className="px-8 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
              onClick={() => navigate("/citizen/dashboard")}
            >
              {LABELS.cancel}
            </button>
            <button
              type="submit"
              className={`px-8 py-2 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-600 shadow-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {LABELS.submit}
            </button>
          </div>

          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>

        <aside className="lg:col-span-1 sticky top-24 space-y-6">
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

          <ImpactStatsCard
            filed={impactStats.filed}
            resolved={impactStats.resolved}
            message={impactStats.message}
            header={LABELS.impactHeader}
          />
        </aside>
      </div>

      {submittedComplaint && (
        <ComplaintDetails
          isOpen={!!submittedComplaint}
          onClose={resetForm}
          variant="success"
          issueData={{
            id: submittedComplaint.trackingId,
            title: submittedComplaint.title,
            description: submittedComplaint.description || "",
            category: submittedComplaint.categoryName,
            location: submittedComplaint.locationAddress || address,
            submittedBy: submittedComplaint.citizenName,
            priority: submittedComplaint.priorityLevel,
            ward: submittedComplaint.wardNumber,
            votes: submittedComplaint.netVotes || 0,
            isVerified: submittedComplaint.isVerified || false,
            status: submittedComplaint.statusName,
            date: new Date(submittedComplaint.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            ),
            photoUrls: submittedComplaint.photoUrls || [],
            photos: submittedComplaint.photoUrls || [],
            latitude:
              submittedComplaint.latitude ?? (latlng ? latlng[0] : null),
            longitude:
              submittedComplaint.longitude ?? (latlng ? latlng[1] : null),
          }}
        />
      )}
    </div>
  );
}
