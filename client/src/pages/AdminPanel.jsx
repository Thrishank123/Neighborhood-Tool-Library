import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import Container from "../components/Container";
import Card from "../components/Card";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import Table from "../components/Table";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import { ToastContainer } from "../components/Toast";

const AdminPanel = () => {
  const [tools, setTools] = useState([]);
  const [reports, setReports] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, item: null });
  const [showAddTool, setShowAddTool] = useState(false);
  const [toolForm, setToolForm] = useState({ name: "", description: "", category: "", image: null });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchAll = async () => {
    try {
      const [t, r, res] = await Promise.all([
        api.get("/tools"),
        api.get("/reports"),
        api.get("/reservations")
      ]);
      setTools(t.data);
      setReports(r.data);
      setReservations(res.data);
    } catch (err) {
      addToast("Failed to load admin data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resolveReport = async (id) => {
    try {
      await api.patch(`/reports/${id}/resolve`);
      addToast("Report resolved successfully!");
      fetchAll();
    } catch (err) {
      addToast("Failed to resolve report", "error");
    }
  };

  const deleteTool = async (id) => {
    try {
      await api.delete(`/tools/${id}`);
      addToast("Tool deleted successfully!");
      fetchAll();
    } catch (err) {
      addToast("Failed to delete tool", "error");
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      addToast(`Reservation status updated to ${status}!`);
      fetchAll();
    } catch (err) {
      addToast("Failed to update reservation status", "error");
    }
  };

  const handleAction = (action, item) => {
    setConfirmModal({ isOpen: true, action, item });
  };

  const confirmAction = () => {
    const { action, item } = confirmModal;
    if (action === "delete") deleteTool(item.id);
    else if (action === "resolve") resolveReport(item.id);
    setConfirmModal({ isOpen: false, action: null, item: null });
  };

  const validateToolForm = () => {
    const newErrors = {};
    if (!toolForm.name.trim()) newErrors.name = "Tool name is required";
    if (!toolForm.description.trim()) newErrors.description = "Description is required";
    if (!toolForm.category.trim()) newErrors.category = "Category is required";
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleToolFormChange = (e) => {
    const { name, value } = e.target;
    setToolForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setToolForm((prev) => ({ ...prev, image: file }));
  };

  const handleAddTool = async (e) => {
    e.preventDefault();
    if (!validateToolForm()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", toolForm.name);
      formData.append("description", toolForm.description);
      formData.append("category", toolForm.category);
      if (toolForm.image) {
        formData.append("image", toolForm.image);
      }

      await api.post("/tools", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      addToast("Tool added successfully!");
      setToolForm({ name: "", description: "", category: "", image: null });
      setShowAddTool(false);
      fetchAll();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add tool";
      addToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-50";
      case "pending": return "text-yellow-600 bg-yellow-50";
      case "closed": return "text-gray-600 bg-gray-50";
      default: return "text-neutral-600 bg-neutral-50";
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-neutral-600">Loading admin panel...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Dashboard</h1>
        <p className="text-neutral-600">Manage tools, reservations, and damage reports</p>
      </div>

      <div className="space-y-8">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Tools Management</h2>
            <Button onClick={() => setShowAddTool(true)}>
              Add New Tool
            </Button>
          </div>
          {tools.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">No tools available.</p>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tools.map((t) => (
                  <Table.Tr key={t.id}>
                    <Table.Td>{t.id}</Table.Td>
                    <Table.Td className="font-medium">{t.name}</Table.Td>
                    <Table.Td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {t.category}
                      </span>
                    </Table.Td>
                    <Table.Td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleAction("delete", t)}
                      >
                        Delete
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Reservations Management</h2>
          {reservations.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">No reservations found.</p>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Tool</Table.Th>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Start Date</Table.Th>
                  <Table.Th>End Date</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {reservations.map((r) => (
                  <Table.Tr key={r.id}>
                    <Table.Td>{r.id}</Table.Td>
                    <Table.Td className="font-medium">{r.tool_name}</Table.Td>
                    <Table.Td>{r.user_name || "N/A"}</Table.Td>
                    <Table.Td>{new Date(r.start_date).toLocaleDateString()}</Table.Td>
                    <Table.Td>{new Date(r.end_date).toLocaleDateString()}</Table.Td>
                    <Table.Td>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </Table.Td>
                    <Table.Td>
                      <select
                        value={r.status}
                        onChange={(e) => changeStatus(r.id, e.target.value)}
                        className="input text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                      </select>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Damage Reports</h2>
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
                  <Table.Th>Actions</Table.Th>
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
                    <Table.Td>
                      {!r.resolved && (
                        <Button
                          size="sm"
                          onClick={() => handleAction("resolve", r)}
                        >
                          Resolve
                        </Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Card>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, item: null })}
        title="Confirm Action"
      >
        <p className="text-neutral-700 mb-4">
          Are you sure you want to {confirmModal.action} this {confirmModal.item?.name ? "tool" : "report"}?
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => setConfirmModal({ isOpen: false, action: null, item: null })}
          >
            Cancel
          </Button>
          <Button onClick={confirmAction}>
            Confirm
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showAddTool}
        onClose={() => {
          setShowAddTool(false);
          setToolForm({ name: "", description: "", category: "", image: null });
          setFormErrors({});
        }}
        title="Add New Tool"
      >
        <form onSubmit={handleAddTool} className="space-y-4">
          <FormInput
            label="Tool Name"
            name="name"
            value={toolForm.name}
            onChange={handleToolFormChange}
            error={formErrors.name}
            placeholder="Enter tool name"
            required
          />
          <FormInput
            label="Description"
            name="description"
            value={toolForm.description}
            onChange={handleToolFormChange}
            error={formErrors.description}
            placeholder="Enter tool description"
            required
          />
          <FormInput
            label="Category"
            name="category"
            value={toolForm.category}
            onChange={handleToolFormChange}
            error={formErrors.category}
            placeholder="Enter tool category (e.g., Power Tools, Hand Tools)"
            required
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tool Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddTool(false);
                setToolForm({ name: "", description: "", category: "", image: null });
                setFormErrors({});
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="sm" className="mr-2" /> : null}
              Add Tool
            </Button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Container>
  );
};

export default AdminPanel;
