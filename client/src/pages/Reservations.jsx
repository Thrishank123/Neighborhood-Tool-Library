import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import Container from "../components/Container";
import Card from "../components/Card";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Table from "../components/Table";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({ tool_id: "", start_date: "", end_date: "" });
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

  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (err) {
      addToast("Failed to load reservations", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tool_id) newErrors.tool_id = "Tool ID is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post("/reservations", formData);
      addToast("Reservation requested successfully!");
      setFormData({ tool_id: "", start_date: "", end_date: "" });
      fetchReservations();
    } catch (err) {
      const message = err.response?.data?.message || "Reservation failed";
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
    fetchReservations();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-50";
      case "pending": return "text-yellow-600 bg-yellow-50";
      case "closed": return "text-gray-600 bg-gray-50";
      default: return "text-neutral-600 bg-neutral-50";
    }
  };

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-neutral-600">Loading reservations...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Reservations</h1>
        <p className="text-neutral-600">Manage your tool reservations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">New Reservation</h2>
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

              <FormInput
                label="Start Date"
                type="date"
                name="start_date"
                id="start_date"
                value={formData.start_date}
                onChange={handleChange}
                error={errors.start_date}
                required
                min={new Date().toISOString().split('T')[0]}
              />

              <FormInput
                label="End Date"
                type="date"
                name="end_date"
                id="end_date"
                value={formData.end_date}
                onChange={handleChange}
                error={errors.end_date}
                required
                min={formData.start_date || new Date().toISOString().split('T')[0]}
              />

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
                  "Reserve Tool"
                )}
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Reservation History</h2>
            {reservations.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">No reservations found.</p>
            ) : (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Tool</Table.Th>
                    <Table.Th>Start Date</Table.Th>
                    <Table.Th>End Date</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {reservations.map((r) => (
                    <Table.Tr key={r.id}>
                      <Table.Td>{r.id}</Table.Td>
                      <Table.Td className="font-medium">{r.tool_name}</Table.Td>
                      <Table.Td>{new Date(r.start_date).toLocaleDateString()}</Table.Td>
                      <Table.Td>{new Date(r.end_date).toLocaleDateString()}</Table.Td>
                      <Table.Td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
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
  );
};

export default Reservations;
