import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
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
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log("Login: Attempting login with:", formData.email);
      const res = await api.post("/auth/login", formData);
      console.log("Login: Login response:", res.data);
      console.log("Login: Saving token and user to localStorage");
      login(res.data.user, res.data.token);
      addToast("Login successful!");
      setTimeout(() => navigate("/tools"), 1000);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      console.error("Login: Login failed:", message);
      addToast(message, "error");
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="min-h-screen bg-[url('https://www.shareable.net/wp-content/uploads/2018/12/blog_top-image_tools.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      {/* Outer Container - Glassmorphism Effect */}
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        {/* Inner Container - Content Card */}
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Column - Image */}
          <div className="lg:w-1/2 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center p-8 lg:p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl mb-8 shadow-xl">
                <span className="text-5xl">⭐</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Neighborhood Tool Library</h2>
              <p className="text-lg text-white/90 max-w-md mx-auto">
                Share, borrow, and connect with your community through our tool-sharing platform.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md">
              {/* Logo */}
              <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">Welcome Back</h1>
                <p className="text-neutral-600">Sign into your account</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <FormInput
                  label="Email address"
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />

                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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
                      Signing in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>

              {/* Forgot Password Link */}
              <div className="mt-6 text-center">
                <button className="text-primary hover:text-primary/80 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1">
                  Forgot password?
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-neutral-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    className="text-primary hover:text-primary/80 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    Sign up
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

export default Login;
