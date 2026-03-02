import React, { useRef } from "react";
import { MdAddAPhoto } from "react-icons/md";

export default function PhotoUploader({
  photos,
  setPhotos,
  error,
  setError,
  MAX_PHOTOS,
  MAX_TOTAL_SIZE,
}) {
  const fileInputRef = useRef();

  const handlePhotoInput = (e) => {
    const files = Array.from(e.target.files);
    const totalSize =
      files.reduce((acc, f) => acc + f.size, 0) +
      photos.reduce((acc, f) => acc + f.size, 0);
    if (
      photos.length + files.length > MAX_PHOTOS ||
      totalSize > MAX_TOTAL_SIZE
    ) {
      setError("You can upload up to 3 photos (max total size: 15MB).");
      return;
    }
    setPhotos([...photos, ...files]);
    setError("");
  };

  const removePhoto = (idx) => setPhotos(photos.filter((_, i) => i !== idx));

  return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(MAX_PHOTOS)].map((_, i) => {
        const photo = photos[i];
        return (
          <div
            key={i}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center"
          >
            {photo ? (
              <div className="relative w-full h-full">
                <img
                  src={URL.createObjectURL(photo)}
                  className="w-full h-full object-cover"
                  alt={`Uploaded ${i + 1}`}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 text-xs px-2 py-1 border border-gray-400 rounded bg-white"
                  onClick={() => removePhoto(i)}
                >
                  Remove
                </button>
              </div>
            ) : i === photos.length ? (
              <div
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors text-center"
                onClick={() => fileInputRef.current.click()}
              >
                <MdAddAPhoto className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <span className="text-xs text-gray-500">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                  onChange={handlePhotoInput}
                />
              </div>
            ) : (
              <MdAddAPhoto className="w-8 h-8 text-gray-300" />
            )}
          </div>
        );
      })}
      {error && <div className="text-red-500 mt-2 col-span-3">{error}</div>}
    </div>
  );
}
