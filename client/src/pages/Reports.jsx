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
      <div className="min-h-screen pt-20">
        <Container className="py-12">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-neutral-600">Loading reports...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
        <Container className="py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Reports</h1>
            <p className="text-neutral-600">Report damaged tools and view report history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Report Damage</h2>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <FormInput
                    label="Tool ID"
                    type="number"
                    name="tool_id"
                    id="tool_id"
                    value={formData.tool_id}
                    onChange={handleChange}
                    error={errors.tool_id}
                    placeholder="Enter tool ID"
                    required
                    min="1"
                  />

                  <div className="mb-4">
                    <label className="label" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`input resize-none ${errors.description ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
                      placeholder="Describe the damage or issue..."
                      rows="4"
                      required
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
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
                  </Button>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Report History</h2>
                {reports.length === 0 ? (
                  <p className="text-neutral-500 text-center py-8">No reports found.</p>
                ) : (
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>ID</Table.Th>
                        <Table.Th>Tool</Table.Th>
                        <Table.Th>Reporter</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {reports.map((r) => (
                        <Table.Tr key={r.id}>
                          <Table.Td>{r.id}</Table.Td>
                          <Table.Td className="font-medium">{r.tool_name}</Table.Td>
                          <Table.Td>{r.reporter}</Table.Td>
                          <Table.Td className="max-w-xs truncate" title={r.description}>
                            {r.description}
                          </Table.Td>
                          <Table.Td>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              r.resolved
                                ? "text-green-600 bg-green-50"
                                : "text-yellow-600 bg-yellow-50"
                            }`}>
                              {r.resolved ? "Resolved" : "Pending"}
                            </span>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Card>
            </div>
          </div>

          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </Container>
      </div>
    );
};

export default Reports;
