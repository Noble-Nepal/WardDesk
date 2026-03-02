import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { MdContentCopy, MdCheck, MdDownload } from "react-icons/md";

const QRCodeSection = ({ trackingId, title }) => {
  const [copied, setCopied] = useState(false);

  const qrData = `${window.location.origin}/track/${trackingId}`;
  const handleCopyId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
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
      link.download = `issue-${trackingId}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgString)));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 w-full">
        {/* QR Header */}
        <div className="text-center mb-6">
          {/* Active Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-700">Active</span>
          </div>
          <h3 className="text-base sm:text-lg text-gray-900 mb-1">
            Tracking QR Code
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            Scan to track issue status
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrData}
              size={
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 180
                  : 200
              }
              level="H"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        {/* Tracking ID + Copy */}
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

          {/* Download Button */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDownloadQR}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors"
            >
              <MdDownload className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeSection;
