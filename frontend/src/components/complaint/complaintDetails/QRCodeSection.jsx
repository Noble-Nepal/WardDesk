import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { MdContentCopy, MdCheck, MdDownload } from "react-icons/md";

const getStatusPill = (status = "", isSuccessVariant = false) => {
  if (isSuccessVariant) {
    return {
      dotClass: "bg-green-500 animate-pulse",
      textClass: "text-gray-700",
      label: "Active",
    };
  }

  const s = String(status).toLowerCase();

  if (s.includes("resolved")) {
    return {
      dotClass: "bg-green-500",
      textClass: "text-green-700",
      label: "Resolved",
    };
  }
  if (s.includes("rejected")) {
    return {
      dotClass: "bg-red-500",
      textClass: "text-red-700",
      label: "Rejected",
    };
  }
  if (s.includes("progress") || s.includes("work") || s.includes("assigned")) {
    return {
      dotClass: "bg-blue-500",
      textClass: "text-blue-700",
      label: "In Progress",
    };
  }

  return {
    dotClass: "bg-yellow-500",
    textClass: "text-yellow-700",
    label: "Pending",
  };
};

const QRCodeSection = ({
  trackingId,
  issueTitle,
  category,
  location,
  status,
  qrId = "tracked-qr-code",
  downloadFileName = "complaint-qr.png",
  isSuccessVariant = false,
  successDownloadLabel = "Download",
}) => {
  const [copied, setCopied] = useState(false);

  const trackingUrl = `${window.location.origin}/track/${trackingId}`;

  const qrPayload = useMemo(
    () =>
      JSON.stringify({
        issueId: trackingId,
        title: issueTitle || "",
        category: category || "",
        location: location || "",
        trackingUrl,
      }),
    [trackingId, issueTitle, category, location, trackingUrl],
  );

  const statusPill = getStatusPill(status, isSuccessVariant);

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(String(trackingId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById(qrId);
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      const link = document.createElement("a");
      link.download = downloadFileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgString)));
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 mb-4">
          <span className={`w-2 h-2 rounded-full ${statusPill.dotClass}`} />
          <span className={`text-sm ${statusPill.textClass}`}>
            {statusPill.label}
          </span>
        </div>

        <h3 className="text-base sm:text-lg text-gray-900 mb-1">
          Tracking QR Code
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">
          Scan to track issue status
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
          <QRCodeSVG
            id={qrId}
            value={qrPayload}
            size={180}
            level="H"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4">
          <p className="text-xs text-gray-500 mb-1">Tracking ID</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-base sm:text-lg text-gray-900 tracking-wide truncate">
              #{trackingId}
            </span>
            <button
              onClick={handleCopyId}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors shrink-0"
            >
              {copied ? (
                <MdCheck className="w-4 h-4 text-green-600" />
              ) : (
                <MdContentCopy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {isSuccessVariant ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDownloadQR}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-sm transition-colors"
            >
              <MdDownload className="w-4 h-4 mr-2" />
              {successDownloadLabel}
            </button>
          </div>
        ) : (
          <button
            onClick={handleDownloadQR}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-sm transition-colors"
          >
            <MdDownload className="w-4 h-4 mr-2" />
            Download QR Code
          </button>
        )}
      </div>
    </div>
  );
};

export default QRCodeSection;
