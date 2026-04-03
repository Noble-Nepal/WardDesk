import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, RefreshCw } from "lucide-react";
import { forgotPassword } from "../../api/authApi";
import SuccessToast from "../../components/ui/SuccessToast";
import ErrorAlert from "../../components/ui/ErrorAlert";

const maskEmail = (email) => {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  const visible = local.slice(0, 2);
  const hiddenCount = Math.max(local.length - 2, 2);
  return `${visible}${"*".repeat(hiddenCount)}@${domain}`;
};

const ResetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [serverError, setServerError] = useState("");

  const maskedEmail = useMemo(() => maskEmail(email), [email]);

  const showSuccessToast = (title, message) => {
    toast.custom(
      (t) => (
        <div className={`${t.visible ? "animate-enter" : "animate-leave"}`}>
          <SuccessToast title={title} message={message} />
        </div>
      ),
      {
        duration: 3500,
        style: { padding: "0", background: "transparent", boxShadow: "none" },
      },
    );
  };

  const startResendTimer = () => setResendTimer(60);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSend = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      setTimeout(() => {
        setStep("sent");
        startResendTimer();
        setIsLoading(false);
        showSuccessToast(
          "Reset link sent",
          `A password reset link has been sent to ${email}`,
        );
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      setServerError(
        err?.response?.data?.message ||
          "Could not send reset link. Please try again.",
      );
    }
  };

  const handleResend = async () => {
    if (isLoading || resendTimer > 0) return;
    setServerError("");
    setIsLoading(true);

    try {
      await forgotPassword(email.trim());
      setTimeout(() => {
        setResendCount((c) => c + 1);
        startResendTimer();
        setIsLoading(false);
        showSuccessToast(
          "Reset link resent",
          `A new password reset link has been sent to ${email}`,
        );
      }, 1200);
    } catch (err) {
      setIsLoading(false);
      setServerError(
        err?.response?.data?.message || "Could not resend reset link.",
      );
    }
  };

  return (
    <div className="flex min-h-screen">
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
          <p className="text-sm text-gray-300 mb-2">Account Recovery</p>
          <h1 className="text-5xl font-bold leading-tight mb-3">
            Reset Password
          </h1>
          <p className="text-lg text-gray-300">
            We will send a secure reset link to your email
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col bg-white min-h-screen">
        <div className="flex justify-end items-center gap-4 px-8 py-6">
          <button
            onClick={() =>
              step === "email" ? navigate("/login") : setStep("email")
            }
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {step === "email" ? "Back to Login" : "Change Email"}
          </button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-400">·</span>
            <Link
              to="/"
              className="text-sm text-red-500 font-medium hover:text-red-600 transition-colors"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 md:px-16 pt-4 pb-10">
          <div className="w-full max-w-md">
            <ErrorAlert message={serverError} />

            {step === "email" ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-500 mb-8">
                  Enter the email address associated with your account. We will
                  send you a reset link.
                </p>

                <form onSubmit={handleSend} className="flex flex-col gap-5">
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
                        if (serverError) setServerError("");
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 text-white text-base font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isLoading
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Back to Login
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-gray-600">
                    We have sent a password reset link to:
                  </p>
                  <p className="text-gray-900 mt-2 font-medium">
                    {maskedEmail}
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p className="text-xs text-yellow-800">
                    The link will expire in 1 hour for security purposes. If you
                    do not see the email, check your spam or junk folder.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading || resendTimer > 0}
                    className="w-full py-3.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors flex items-center justify-center"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                    />
                    {isLoading
                      ? "Resending..."
                      : resendTimer > 0
                        ? `Resend Link (${resendTimer}s)`
                        : "Resend Reset Link"}
                  </button>

                  {resendCount > 0 && (
                    <p className="text-center text-xs text-gray-500">
                      Reset link resent {resendCount}{" "}
                      {resendCount === 1 ? "time" : "times"}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full py-3.5 text-white text-base font-semibold rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Back to Login
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Wrong email address?{" "}
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Try a different email
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
