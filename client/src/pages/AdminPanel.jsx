import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import Container from "../components/Container";
import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";
import Modal from "../components/Modal";

const AdminPanel = () => {
  const [tools, setTools] = useState([]);
  const [reports, setReports] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchAll = async () => {
    try {
      const [t, r, res, pendingRes] = await Promise.all([
        api.get("/tools"),
        api.get("/reports"),
        api.get("/reservations"),
        api.get("/reservations/pending")
      ]);
      setTools(t.data);
      setReports(r.data);
      setReservations(res.data);
      setPendingReservations(pendingRes.data);
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

  const approveReservation = async (id) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status: 'approved' });
      addToast("Reservation approved successfully!");
      fetchAll();
    } catch (err) {
      addToast("Failed to approve reservation", "error");
    }
  };

  const rejectReservation = async (id) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status: 'rejected' });
      addToast("Reservation rejected successfully!");
      fetchAll();
    } catch (err) {
      addToast("Failed to reject reservation", "error");
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
      <div className="min-h-screen pt-20">
        <Container className="py-12">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-neutral-600">Loading admin panel...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Panel</h1>
          <p className="text-neutral-600">Manage tools, reservations, and damage reports</p>
        </div>

        <div className="space-y-8">
          <Card>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Tools Management</h2>
              <div className="flex gap-2">
                <Button onClick={() => setShowPendingModal(true)} variant="secondary" className="w-full sm:w-auto">
                  Pending Reservations ({pendingReservations.length})
                </Button>
                <Button onClick={() => addToast("Add tool functionality not implemented", "info")} className="w-full sm:w-auto">
                  Add New Tool
                </Button>
              </div>
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
                          onClick={() => deleteTool(t.id)}
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
                            onClick={() => resolveReport(r.id)}
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

        <Modal isOpen={showPendingModal} onClose={() => setShowPendingModal(false)} title="Pending Reservations">
          {pendingReservations.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">No pending reservations.</p>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Tool</Table.Th>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Start Date</Table.Th>
                  <Table.Th>End Date</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {pendingReservations.map((r) => (
                  <Table.Tr key={r.id}>
                    <Table.Td>{r.id}</Table.Td>
                    <Table.Td className="font-medium">{r.tool_name}</Table.Td>
                    <Table.Td>{r.user_name || "N/A"}</Table.Td>
                    <Table.Td>{new Date(r.start_date).toLocaleDateString()}</Table.Td>
                    <Table.Td>{new Date(r.end_date).toLocaleDateString()}</Table.Td>
                    <Table.Td>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveReservation(r.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => rejectReservation(r.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Modal>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </Container>
    </div>
  );
};

export default AdminPanel;
