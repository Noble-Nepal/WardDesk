// Ward options
export const WARD_OPTIONS = Array.from({ length: 26 }, (_, i) => i + 1);

// Priority options, each with display and styling atoms
export const PRIORITY_OPTIONS = [
  {
    value: "low",
    label: "Low Priority",
    description: "Non-urgent, routine maintenance",
    color: "blue-500",
    dot: "bg-blue-500",
    selectedClass: "border-blue-500 bg-blue-50",
    badgeClass: "bg-blue-100 text-blue-700",
  },
  {
    value: "medium",
    label: "Medium Priority",
    description: "Needs attention within weeks",
    color: "yellow-500",
    dot: "bg-yellow-500",
    selectedClass: "border-yellow-500 bg-yellow-50",
    badgeClass: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "high",
    label: "High Priority",
    description: "Requires attention within days",
    color: "orange-500",
    dot: "bg-orange-500",
    selectedClass: "border-orange-500 bg-orange-50",
    badgeClass: "bg-orange-100 text-orange-700",
  },
  {
    value: "urgent",
    label: "Urgent",
    description: "Immediate action required",
    color: "red-500",
    dot: "bg-red-500",
    selectedClass: "border-red-500 bg-red-50",
    badgeClass: "bg-red-100 text-red-700",
  },
];

// Helper to get priority badge class by value
export const getPriorityBadgeClass = (priority) => {
  const option = PRIORITY_OPTIONS.find(
    (opt) => opt.value === priority?.toLowerCase(),
  );
  return option?.badgeClass || "bg-gray-100 text-gray-700";
};

// Helper to get priority label by value
export const getPriorityLabel = (priority) => {
  const option = PRIORITY_OPTIONS.find(
    (opt) => opt.value === priority?.toLowerCase(),
  );
  return option?.label || priority || "Unknown";
};

// Max photos; max size for all uploads
export const MAX_PHOTOS = 3;
export const MAX_TOTAL_SIZE = 15 * 1024 * 1024; // 15 MB
export const DESCRIPTION_MAX_LENGTH = 500;
export const DEFAULT_PRIORITY = "low";
export const REPORT_TIPS = [
  "Clear Photos - Take clear, well-lit photos showing the issue",
  "Accurate Location - Double check the pin location on map",
  "Detailed Description - Include when you noticed this issue and any other details",
  "Choose Right Category - Select the most relevant category for faster response",
];

export const LABELS = {
  pageTitle: "Report a New Issue",
  pageSubtitle: "Help us improve your community by reporting civic issues",
  backToDashboard: "Back to Dashboard",
  basicInfo: "Basic Information",
  locationInfo: "Location Information",
  uploadPhotos: "Upload Photos",
  priorityLevel: "Priority Level",
  contactPreferences: "Contact Preferences",
  cancel: "Cancel",
  submit: "Submit Issue",
  tipsHeader: "Tips for Better Reports",
  impactHeader: "Your Impact",
};
// Validation Messages
export const VALIDATION_MESSAGES = {
  requiredFields:
    "Please fill all required fields and pick a location on the map.",
  submitError: "Failed to submit issue. Please try again.",
  categoryError: "Failed to load categories.",
};
//  Toast Config
export const TOAST_CONFIG = {
  title: "Report Submitted!",
  message: "Your issue has been successfully filed.",
  duration: 4000,
  style: {
    padding: "0",
    background: "transparent",
    boxShadow: "none",
  },
};
//  Placeholder Text
export const PLACEHOLDERS = {
  title: "Brief description of the issue",
  description: "Provide detailed information about the issue",
  address: "Address and nearby landmarks",
};
