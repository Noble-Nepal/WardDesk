import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { registerUser } from "../../api/authApi";
import handleImageUpload from "../../utils/handleImageUpload";
import SuccessToast from "../../components/ui/SuccessToast";
import EyeToggle from "../../components/ui/EyeToggle";
import ErrorAlert from "../../components/ui/ErrorAlert";

// -------- Validation Schemas --------
const citizenSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  wardNumber: Yup.number()
    .typeError("Ward number must be a number")
    .min(1, "Ward number must be at least 1")
    .required("Ward number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),
  terms: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

const technicianSchema = citizenSchema.shape({
  citizenshipPhoto: Yup.mixed().required("Citizenship photo is required"),
});

const Registration = () => {
  const [roleType, setRoleType] = useState("citizen");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [wardNumber, setWardNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [citizenshipPhoto, setCitizenshipPhoto] = useState(null);
  const [citizenshipPreview, setCitizenshipPreview] = useState(null);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isTechnician = roleType === "technician";

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCitizenshipPhoto(file);
      setCitizenshipPreview(URL.createObjectURL(file));
      if (errors.citizenshipPhoto)
        setErrors((prev) => ({ ...prev, citizenshipPhoto: "" }));
    }
  };

  const clearFieldError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (serverError) setServerError("");
  };

  const validate = async () => {
    const schema = isTechnician ? technicianSchema : citizenSchema;
    try {
      await schema.validate(
        {
          fullName,
          email,
          phoneNumber,
          address,
          wardNumber,
          password,
          confirmPassword,
          terms,
          ...(isTechnician && { citizenshipPhoto }),
        },
        { abortEarly: false },
      );
      setErrors({});
      return true;
    } catch (err) {
      const fieldErrors = {};
      err.inner.forEach((e) => {
        fieldErrors[e.path] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const isValid = await validate();
    if (!isValid) return;

    setLoading(true);

    try {
      let citizenshipPhotoUrl = null;
      if (isTechnician && citizenshipPhoto) {
        citizenshipPhotoUrl = await handleImageUpload(citizenshipPhoto);
      }

      await registerUser({
        email,
        password,
        fullName,
        phoneNumber,
        address,
        wardNumber: parseInt(wardNumber),
        roleType,
        citizenshipPhotoUrl,
      });

      toast.custom(
        (t) => (
          <div className={`${t.visible ? "animate-enter" : "animate-leave"}`}>
            <SuccessToast
              title="Registration Successful!"
              message={
                isTechnician
                  ? "Your account is pending admin verification."
                  : "Welcome to WardDesk!"
              }
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
        navigate("/login");
      }, 1000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Report Issues Instantly",
    "Track Progress in Real-time",
    "Engage with Community",
    "Get AI-Powered Guidance",
  ];

  return (
    <div className="flex min-h-screen">
      {/* -------- LEFT PANEL -------- */}
      <div
        className="hidden md:flex md:w-1/2 flex-col px-10 py-10 text-white"
        style={{
          background: "linear-gradient(180deg, #1a237e 0%, #1565c0 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-24">
          <img src="/logo.png" alt="WardDesk" className="h-8" />
          <span className="text-xl font-bold tracking-tight">WardDesk</span>
        </div>

        <div className="mb-16">
          <p className="text-sm text-gray-300 mb-2">Join the</p>
          <h1 className="text-5xl font-bold leading-tight mb-3">WardDesk</h1>
          <p className="text-lg text-gray-300">Community Platform</p>
        </div>

        <div className="flex flex-col gap-6">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center shrink-0">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  className="text-blue-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-base">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* -------- RIGHT PANEL -------- */}
      <div className="w-full md:w-1/2 flex flex-col bg-white min-h-screen">
        <div className="flex justify-end items-center gap-4 px-8 py-6">
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
            <span>नेपाली</span>
            <svg
              width="12"
              height="12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-400">·</span>
            <Link to="/" className="text-sm text-red-500 font-medium">
              Back
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 md:px-16 pt-4 pb-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 mb-8">
              Sign up to start using WardDesk
            </p>

            <ErrorAlert message={serverError} />

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* -------- Account Type -------- */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleType("citizen");
                      setCitizenshipPhoto(null);
                      setCitizenshipPreview(null);
                    }}
                    className={`
                      relative p-4 rounded-lg border-2 text-left transition-all duration-200
                      ${
                        roleType === "citizen"
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-semibold text-sm ${
                          roleType === "citizen"
                            ? "text-red-600"
                            : "text-gray-800"
                        }`}
                      >
                        Citizen
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          roleType === "citizen"
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        {roleType === "citizen" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Report and track community issues
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoleType("technician")}
                    className={`
                      relative p-4 rounded-lg border-2 text-left transition-all duration-200
                      ${
                        roleType === "technician"
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`font-semibold text-sm ${
                          roleType === "technician"
                            ? "text-red-600"
                            : "text-gray-800"
                        }`}
                      >
                        Technician
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          roleType === "technician"
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        {roleType === "technician" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Resolve issues and manage tasks
                    </p>
                  </button>
                </div>
              </div>

              {/* -------- Full Name -------- */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearFieldError("fullName");
                  }}
                  className={`
                    w-full px-4 py-3 border rounded-lg text-sm text-gray-700 placeholder-gray-400
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent
                    ${
                      errors.fullName
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }
                  `}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* -------- Email -------- */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="yourname@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                  }}
                  className={`
                    w-full px-4 py-3 border rounded-lg text-sm text-gray-700 placeholder-gray-400
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent
                    ${
                      errors.email
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }
                  `}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* -------- Phone Number -------- */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+977 9812345678"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    clearFieldError("phoneNumber");
                  }}
                  className={`
                    w-full px-4 py-3 border rounded-lg text-sm text-gray-700 placeholder-gray-400
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent
                    ${
                      errors.phoneNumber
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }
                  `}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* -------- Address -------- */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    clearFieldError("address");
                  }}
                  className={`
                    w-full px-4 py-3 border rounded-lg text-sm text-gray-700 placeholder-gray-400
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent
                    ${
                      errors.address
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }
                  `}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* -------- Ward Number -------- */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Ward Number
                </label>
                <input
                  type="number"
                  placeholder="Enter your ward number"
                  value={wardNumber}
                  onChange={(e) => {
                    setWardNumber(e.target.value);
                    clearFieldError("wardNumber");
                  }}
                  className={`
                    w-full px-4 py-3 border rounded-lg text-sm text-gray-700 placeholder-gray-400
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent
                    ${
                      errors.wardNumber
                        ? "border-red-400 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }
                  `}
                />
                {errors.wardNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.wardNumber}
                  </p>
                )}
              </div>

              {/* -------- Citizenship Photo (Technician only) -------- */}
              {isTechnician && (
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Citizenship Photo{" "}
                    <span className="font-normal text-gray-400">
                      (Required for verification)
                    </span>
                  </label>

                  {citizenshipPreview ? (
                    <div className="relative">
                      <img
                        src={citizenshipPreview}
                        alt="Citizenship preview"
                        className="w-full h-40 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCitizenshipPhoto(null);
                          setCitizenshipPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`
                        flex flex-col items-center justify-center w-full py-4
                        border-2 border-dashed rounded-lg cursor-pointer
                        transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50
                        ${
                          errors.citizenshipPhoto
                            ? "border-red-400 bg-red-50/50"
                            : "border-gray-300"
                        }
                      `}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="text-gray-400 mb-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <span className="text-sm text-gray-500">
                        Upload Citizenship Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}

                  <p className="text-xs text-gray-400 mt-1">
                    Admin will verify your citizenship before granting
                    technician access
                  </p>
                  {errors.citizenshipPhoto && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.citizenshipPhoto}
                    </p>
                  )}
                </div>
              )}

              {/* -------- Password -------- */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError("password");
                    }}
                    className={`
                      w-full px-4 py-3 pr-12 border rounded-lg text-sm text-gray-700 placeholder-gray-400
                      transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent
                      ${
                        errors.password
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-blue-500"
                      }
                    `}
                  />
                  <EyeToggle
                    show={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* -------- Confirm Password -------- */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError("confirmPassword");
                    }}
                    className={`
                      w-full px-4 py-3 pr-12 border rounded-lg text-sm text-gray-700 placeholder-gray-400
                      transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent
                      ${
                        errors.confirmPassword
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-blue-500"
                      }
                    `}
                  />
                  <EyeToggle
                    show={showConfirmPassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* -------- Terms -------- */}
              <div>
                <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => {
                      setTerms(e.target.checked);
                      clearFieldError("terms");
                    }}
                    className="w-4 h-4 rounded accent-blue-600 mt-0.5"
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
                )}
              </div>

              {/* -------- Submit -------- */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3.5 text-white text-base font-semibold rounded-lg
                  transition-all duration-200 flex items-center justify-center gap-2
                  ${
                    loading
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 active:scale-[0.98]"
                  }
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6 mb-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red-500 font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
