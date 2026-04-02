import {
  PROFILE_INPUT_PATTERNS,
  PROFILE_LIMITS,
  PROFILE_MESSAGES,
} from "../constants/profileSettingsConstants";

const normalizeText = (v) => (v ?? "").toString().trim();

export const validatePersonalInfo = (form) => {
  const errors = {};

  const fullName = normalizeText(form.fullName);
  const phoneNumber = normalizeText(form.phoneNumber);
  const address = normalizeText(form.address);
  const wardRaw = normalizeText(form.wardNumber);

  if (!fullName) {
    errors.fullName = PROFILE_MESSAGES.fullNameRequired;
  } else if (
    fullName.length > PROFILE_LIMITS.nameMax ||
    !PROFILE_INPUT_PATTERNS.name.test(fullName)
  ) {
    errors.fullName = PROFILE_MESSAGES.fullNameInvalid;
  }

  if (!phoneNumber) {
    errors.phoneNumber = PROFILE_MESSAGES.phoneRequired;
  } else if (
    phoneNumber.length > PROFILE_LIMITS.phoneMax ||
    !PROFILE_INPUT_PATTERNS.phone.test(phoneNumber)
  ) {
    errors.phoneNumber = PROFILE_MESSAGES.phoneInvalid;
  }

  if (!wardRaw) {
    errors.wardNumber = PROFILE_MESSAGES.wardRequired;
  } else {
    const ward = Number(wardRaw);
    const wardIsInt = Number.isInteger(ward);
    if (
      !wardIsInt ||
      ward < PROFILE_LIMITS.wardMin ||
      ward > PROFILE_LIMITS.wardMax
    ) {
      errors.wardNumber = PROFILE_MESSAGES.wardInvalid;
    }
  }

  if (!address) {
    errors.address = PROFILE_MESSAGES.addressRequired;
  } else if (
    address.length < PROFILE_LIMITS.addressMin ||
    address.length > PROFILE_LIMITS.addressMax
  ) {
    errors.address = PROFILE_MESSAGES.addressTooShort;
  }

  return errors;
};

export const validatePasswordChange = (form) => {
  const errors = {};
  const currentPassword = normalizeText(form.currentPassword);
  const newPassword = normalizeText(form.newPassword);
  const confirmPassword = normalizeText(form.confirmPassword);

  const wantsChange = currentPassword || newPassword || confirmPassword;
  if (!wantsChange) return errors;

  if (!currentPassword)
    errors.currentPassword = PROFILE_MESSAGES.currentPasswordRequired;
  if (!newPassword) errors.newPassword = PROFILE_MESSAGES.newPasswordRequired;
  if (!confirmPassword)
    errors.confirmPassword = PROFILE_MESSAGES.confirmPasswordRequired;

  if (newPassword && newPassword.length < 8) {
    errors.newPassword = PROFILE_MESSAGES.newPasswordMin;
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.newPassword = PROFILE_MESSAGES.sameAsCurrent;
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    errors.confirmPassword = PROFILE_MESSAGES.passwordMismatch;
  }

  return errors;
};
