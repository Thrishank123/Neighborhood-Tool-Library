import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Card from "../components/Card";
import Container from "../components/Container";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "member" });
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
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post("/auth/register", formData);
      addToast("Registration successful! Please sign in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-md w-full">
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Account</h1>
            <p className="text-neutral-600">Join the neighborhood tool library</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <FormInput
              label="Full Name"
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />

            <FormInput
              label="Email Address"
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
              placeholder="Create a password (min. 6 characters)"
              required
              autoComplete="new-password"
            />

            <div className="mb-4">
              <label className="label" htmlFor="role">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
                aria-describedby="role-description"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <p id="role-description" className="text-xs text-neutral-500 mt-1">
                Select admin only if you have administrative privileges
              </p>
            </div>

            {errors.general && (
              <div className="text-red-600 text-sm text-center" role="alert">
                {errors.general}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary/80 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </Container>
    </div>
  );
};

export default Register;
