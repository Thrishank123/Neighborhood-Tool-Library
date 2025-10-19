import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import Container from "../components/Container";
import Card from "../components/Card";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Table from "../components/Table";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({ tool_id: "", description: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchReports = async () => {
    try {
      const res = await api.get("/reports");
      if (res) setReports(res.data);
    } catch (err) {
      // Silently fail for non-admin users
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tool_id) newErrors.tool_id = "Tool ID is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post("/reports", formData);
      addToast("Damage report submitted successfully!");
      setFormData({ tool_id: "", description: "" });
      fetchReports();
    } catch (err) {
      const message = err.response?.data?.message || "Error submitting report";
      addToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[url('https://images.squarespace-cdn.com/content/v1/5263da08e4b0b68d00ba1ec4/1656095998584-U12F2E84U3047NPEB5PW/IMG_0193+(1).jpg')] bg-cover bg-center bg-no-repeat pt-24">
        <div className="mx-4 lg:mx-8 xl:mx-16 mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="text-center">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-white/80">Loading reports...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://images.squarespace-cdn.com/content/v1/5263da08e4b0b68d00ba1ec4/1656095998584-U12F2E84U3047NPEB5PW/IMG_0193+(1).jpg')] bg-cover bg-center bg-no-repeat pt-24">
      <div className="mx-4 lg:mx-8 xl:mx-16 mt-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="mb-8">
            <h1 className="text-19xl font-bold text-gray-900 mb-2">Reports</h1>
            <p className="text-16xl text-gray-800">Report damaged tools and view report history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Report Damage</h2>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="tool_id">
                      Tool ID
                    </label>
                    <input
                      type="number"
                      name="tool_id"
                      id="tool_id"
                      value={formData.tool_id}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:bg-white/20 ${errors.tool_id ? "border-red-300 focus:ring-red-300" : "border-white/20 focus:ring-white/50"}`}
                      placeholder="Enter tool ID"
                      required
                      min="1"
                    />
                    {errors.tool_id && (
                      <p className="mt-1 text-sm text-red-300" role="alert">
                        {errors.tool_id}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:bg-white/20 resize-none ${errors.description ? "border-red-300 focus:ring-red-300" : "border-white/20 focus:ring-white/50"}`}
                      placeholder="Describe the damage or issue..."
                      rows="4"
                      required
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-300" role="alert">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Report History</h2>
                {reports.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No reports found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-3 px-4">ID</th>
                          <th className="text-left py-3 px-4">Tool</th>
                          <th className="text-left py-3 px-4">Reporter</th>
                          <th className="text-left py-3 px-4">Description</th>
                          <th className="text-left py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((r) => (
                          <tr key={r.id} className="border-b border-white/10">
                            <td className="py-3 px-4">{r.id}</td>
                            <td className="py-3 px-4 font-medium">{r.tool_name}</td>
                            <td className="py-3 px-4">{r.reporter}</td>
                            <td className="py-3 px-4 max-w-xs truncate" title={r.description}>
                              {r.description}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                r.resolved
                                  ? "text-green-300 bg-green-900/50"
                                  : "text-yellow-300 bg-yellow-900/50"
                              }`}>
                                {r.resolved ? "Resolved" : "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
