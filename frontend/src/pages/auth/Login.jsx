import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { loginUser } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import SuccessToast from "../../components/ui/SuccessToast";
import EyeToggle from "../../components/ui/EyeToggle";
import ErrorAlert from "../../components/ui/ErrorAlert";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = async () => {
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
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
      const data = await loginUser(email, password);
      login(data.accessToken, data.refreshToken);

      toast.custom(
        (t) => (
          <div className={`${t.visible ? "animate-enter" : "animate-leave"}`}>
            <SuccessToast
              title="Login Successful!"
              message="Welcome back to WardDesk"
            />
          </div>
        ),
        {
          duration: 3000,
          style: {
            padding: "0",
            background: "transparent",
            boxShadow: "none",
          },
        },
      );

      const decoded = jwtDecode(data.accessToken);
      const role = decoded[ROLE_CLAIM];

      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "technician":
          navigate("/technician/dashboard");
          break;
        case "citizen":
        default:
          navigate("/citizen/dashboard");
          break;
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Login failed. Please try again.";
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
          <p className="text-sm text-gray-300 mb-2">Welcome to</p>
          <h1 className="text-5xl font-bold leading-tight mb-3">WardDesk</h1>
          <p className="text-lg text-gray-300">
            Building Better Communities Together
          </p>
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

        <div className="flex-1 flex items-start justify-center px-6 md:px-16 pt-12 md:pt-20">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8">
              Login to your WardDesk account to continue
            </p>

            <ErrorAlert message={serverError} />

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
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
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                    if (serverError) setServerError("");
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

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                      if (serverError) setServerError("");
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

              {/*  Forgot Password */}
              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
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
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-red-500 font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
