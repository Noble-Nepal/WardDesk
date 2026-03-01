import imageCompression from "browser-image-compression";
import uploadToCloudinary from "./uploadToCloudinary";

const DEFAULT_OPTIONS = {
  maxSizeMB: 1, // Change as needed for your app
  maxWidthOrHeight: 1000, // Adjust for quality vs. size
  useWebWorker: true,
};

export default async function handleImageUpload(
  file,
  options = DEFAULT_OPTIONS,
) {
  const compressedFile = await imageCompression(file, options);
  return uploadToCloudinary(compressedFile);
}
