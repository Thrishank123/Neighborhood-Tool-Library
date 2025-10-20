import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setIsSubmitted(true);
      addToast("Password reset instructions sent to your email!");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send reset email";
      addToast(message, "error");
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[url('https://www.shareable.net/wp-content/uploads/2018/12/blog_top-image_tools.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            <div className="lg:w-1/2 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-8 lg:p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl mb-8 shadow-xl">
                  <span className="text-5xl">📧</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Check Your Email</h2>
                <p className="text-lg text-white/90 max-w-md mx-auto">
                  We've sent password reset instructions to your email address.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-md text-center">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">Email Sent!</h1>
                <p className="text-neutral-600 mb-8">
                  If an account with that email exists, you'll receive password reset instructions shortly.
                </p>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 text-lg font-semibold"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://www.shareable.net/wp-content/uploads/2018/12/blog_top-image_tools.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          <div className="lg:w-1/2 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-8 lg:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl mb-8 shadow-xl">
                <span className="text-5xl">🔒</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Forgot Your Password?</h2>
              <p className="text-lg text-white/90 max-w-md mx-auto">
                No worries! Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">Reset Password</h1>
                <p className="text-neutral-600">Enter your email to receive reset instructions</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <FormInput
                  label="Email address"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />

                {errors.general && (
                  <div className="text-red-600 text-sm text-center" role="alert">
                    {errors.general}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-3 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-neutral-600">
                  Remember your password?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-primary hover:text-primary/80 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ForgotPassword;
