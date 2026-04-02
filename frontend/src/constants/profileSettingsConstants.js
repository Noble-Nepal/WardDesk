export const PROFILE_INPUT_PATTERNS = {
  phone: /^\+?[0-9]{7,15}$/,
  name: /^[A-Za-z][A-Za-z\s.'-]{1,79}$/,
};

export const PROFILE_UI = {
  PRIMARY: "#2B4AA0",
  PRIMARY_HOVER: "#1d3570",
};

export const PASSWORD_RULE_CHECKS = [
  { key: "len", label: "At least 8 characters", test: (p) => p.length >= 8 },
  {
    key: "case",
    label: "Uppercase and lowercase",
    test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { key: "num", label: "At least one number", test: (p) => /\d/.test(p) },
  {
    key: "sp",
    label: "At least one special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export const PROFILE_MESSAGES = {
  loadError: "Failed to load profile.",
  updateError: "Failed to update profile.",
  updateSuccess: "Profile updated successfully.",
  passwordError: "Failed to update password.",
  passwordSuccess: "Password updated successfully.",
  photoError: "Failed to upload/update photo.",

  fullNameRequired: "Full name is required",
  fullNameInvalid: "Enter a valid full name",
  phoneRequired: "Phone number is required",
  phoneInvalid: "Enter a valid phone number",
  wardRequired: "Ward number is required",
  wardInvalid: "Ward number must be between 1 and 35",
  addressRequired: "Address is required",
  addressTooShort: "Address should be at least 5 characters",

  currentPasswordRequired: "Current password is required",
  newPasswordRequired: "New password is required",
  confirmPasswordRequired: "Confirm password is required",
  newPasswordMin: "Password must be at least 8 characters",
  sameAsCurrent: "New password cannot be same as current password",
  passwordMismatch: "Passwords do not match",
};

export const PROFILE_LIMITS = {
  nameMax: 80,
  phoneMax: 15,
  addressMin: 5,
  addressMax: 180,
  wardMin: 1,
  wardMax: 35,
};

export const getPasswordStrength = (pwd = "") => {
  let score = 0;
  if (pwd.length >= 8) score += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
  if (/\d/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

  if (!pwd)
    return {
      score: 0,
      label: "Weak",
      color: "text-red-600",
      bar: "bg-red-500",
      width: "0%",
    };
  if (score === 1)
    return {
      score,
      label: "Weak",
      color: "text-red-600",
      bar: "bg-red-500",
      width: "25%",
    };
  if (score === 2)
    return {
      score,
      label: "Fair",
      color: "text-orange-600",
      bar: "bg-orange-500",
      width: "50%",
    };
  if (score === 3)
    return {
      score,
      label: "Good",
      color: "text-blue-600",
      bar: "bg-blue-500",
      width: "75%",
    };
  return {
    score,
    label: "Strong",
    color: "text-green-600",
    bar: "bg-green-500",
    width: "100%",
  };
};
