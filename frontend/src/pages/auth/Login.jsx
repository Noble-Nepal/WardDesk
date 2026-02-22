import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { loginUser } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";

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
  const [rememberMe, setRememberMe] = useState(false);
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
      navigate("/");
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
        className="
          hidden md:flex md:w-1/2
          flex-col
          px-10 py-10
          text-white
        "
        style={{
          background: "linear-gradient(180deg, #1a237e 0%, #1565c0 100%)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-24">
          <div className="flex gap-0.5">
            <div className="w-3.5 h-3.5 rounded-sm bg-blue-600" />
            <div className="w-3.5 h-3.5 rounded-sm bg-red-500" />
          </div>
          <span className="text-xl font-bold tracking-tight">WardDesk</span>
        </div>

        {/* Welcome Text */}
        <div className="mb-16">
          <p className="text-sm text-gray-300 mb-2">Welcome to</p>
          <h1 className="text-5xl font-bold leading-tight mb-3">WardDesk</h1>
          <p className="text-lg text-gray-300">
            Building Better Communities Together
          </p>
        </div>

        {/* Feature List */}
        <div className="flex flex-col gap-6">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="
                  w-8 h-8
                  rounded-full
                  bg-blue-500/30
                  flex items-center justify-center
                  shrink-0
                "
              >
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
        {/* Top Links */}
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
            <span className="text-sm text-gray-400">.</span>
            <Link to="/" className="text-sm text-red-500 font-medium">
              Back
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-start justify-center px-6 md:px-16 pt-12 md:pt-20">
          <div className="w-full max-w-md">
            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8">
              Login to your WardDesk account to continue
            </p>

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email Field */}
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
                  }}
                  className={`
                    w-full px-4 py-3
                    border rounded-lg
                    text-sm text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:border-transparent
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

              {/* Password Field */}
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
                    }}
                    className={`
                      w-full px-4 py-3 pr-12
                      border rounded-lg
                      text-sm text-gray-700 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:border-transparent
                      ${
                        errors.password
                          ? "border-red-400 focus:ring-red-400"
                          : "border-gray-300 focus:ring-blue-500"
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute right-4 top-1/2 -translate-y-1/2
                      text-gray-400 hover:text-gray-600
                    "
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3.5
                  text-white text-base font-semibold
                  rounded-lg
                  transition-colors
                  ${
                    loading
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }
                `}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Create Account */}
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
