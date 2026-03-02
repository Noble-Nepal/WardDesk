import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { trackComplaint } from "../../api/complaintApi";
import ComplaintDetails from "../../components/complaint/complaintDetails/ComplaintDetails";

export default function TrackComplaint() {
  const { trackingId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    trackComplaint(trackingId)
      .then((res) => setComplaint(res.data))
      .catch((err) => {
        console.error("Track error:", err);
        // Show the REAL error instead of generic message
        const msg = err.response
          ? `API Error ${err.response.status}: ${JSON.stringify(err.response.data)}`
          : `Network Error: ${err.message}`;
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [trackingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading complaint status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">{error}</p>
          <p className="text-gray-500 text-sm">Tracking ID: {trackingId}</p>
        </div>
      </div>
    );
  }

  return (
    <ComplaintDetails
      isOpen={true}
      onClose={() => {}}
      variant="page"
      issueData={{
        id: complaint.trackingId,
        title: complaint.title,
        description: complaint.description || "",
        category: complaint.categoryName,
        location: complaint.locationAddress || "",
        submittedBy: "", // Hidden for public
        date: new Date(complaint.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      }}
    />
  );
}
