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
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [formState, setFormState] = useState({ name: "", description: "", category: "", imageFile: null });

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
        api.get("/reports/admin"),
        api.get("/reservations/all"),
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
      <div className="pt-24">
        <div className="mx-4 lg:mx-8 xl:mx-16">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="text-center">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-white/80">Loading admin panel...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="mx-4 lg:mx-8 xl:mx-16">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="mb-6">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-sm md:text-base text-white/80">Manage tools, reservations, and damage reports</p>
          </div>

          <div className="space-y-4">
            <div className="bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-lg md:text-xl font-bold text-white">Tools Management</h2>
                <div className="flex flex-row flex-wrap gap-2">
                  <button onClick={() => setShowPendingModal(true)} className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors whitespace-nowrap">
                    Pending Reservations ({pendingReservations.length})
                  </button>
                  <button onClick={() => setShowAddToolModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
                    Add New Tool
                  </button>
                </div>
              </div>
              {tools.length === 0 ? (
                <p className="text-white/60 text-center py-8">No tools available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-2 px-3 text-xs">ID</th>
                        <th className="text-left py-2 px-3 text-xs">Name</th>
                        <th className="text-left py-2 px-3 text-xs">Category</th>
                        <th className="text-left py-2 px-3 text-xs">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tools.map((t) => (
                        <tr key={t.id} className="border-b border-white/10">
                          <td className="py-2 px-3 text-xs">{t.id}</td>
                          <td className="py-2 px-3 text-xs font-medium">{t.name}</td>
                          <td className="py-2 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-white">
                               {t.category}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <button
                              className="bg-red-500/20 text-red-300 px-2 py-1 rounded-lg hover:bg-red-500/30 transition-colors text-xs"
                              onClick={() => deleteTool(t.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4">Reservations Management</h2>
              {reservations.length === 0 ? (
                <p className="text-white/60 text-center py-8">No reservations found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-2 px-3 text-xs">ID</th>
                        <th className="text-left py-2 px-3 text-xs">Tool</th>
                        <th className="text-left py-2 px-3 text-xs">User</th>
                        <th className="text-left py-2 px-3 text-xs">Start Date</th>
                        <th className="text-left py-2 px-3 text-xs">End Date</th>
                        <th className="text-left py-2 px-3 text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((r) => (
                        <tr key={r.id} className="border-b border-white/10">
                          <td className="py-2 px-3 text-xs">{r.id}</td>
                          <td className="py-2 px-3 text-xs font-medium">{r.tool_name}</td>
                          <td className="py-2 px-3 text-xs">{r.user_name || "N/A"}</td>
                          <td className="py-2 px-3 text-xs">{new Date(r.start_date).toLocaleDateString()}</td>
                          <td className="py-2 px-3 text-xs">{new Date(r.end_date).toLocaleDateString()}</td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(r.status)}`}>
                              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4">Damage Reports</h2>
              {reports.length === 0 ? (
                <p className="text-white/60 text-center py-8">No reports found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-2 px-3 text-xs">Report ID</th>
                        <th className="text-left py-2 px-3 text-xs">Tool Name</th>
                        <th className="text-left py-2 px-3 text-xs">Reported By</th>
                        <th className="text-left py-2 px-3 text-xs">Damage Description</th>
                        <th className="text-left py-2 px-3 text-xs">Date</th>
                        <th className="text-left py-2 px-3 text-xs">Status</th>
                        <th className="text-left py-2 px-3 text-xs">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((r) => (
                        <tr key={r.id} className="border-b border-white/10">
                          <td className="py-2 px-3 text-xs">{r.id}</td>
                          <td className="py-2 px-3 text-xs font-medium">{r.tool_name}</td>
                          <td className="py-2 px-3 text-xs">{r.reporter}</td>
                          <td className="py-2 px-3 text-xs max-w-xs truncate" title={r.description}>
                            {r.description}
                          </td>
                          <td className="py-2 px-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              r.resolved
                                ? "text-green-300 bg-green-900/50"
                                : "text-yellow-300 bg-yellow-900/50"
                            }`}>
                              {r.resolved ? "Resolved" : "Pending"}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            {!r.resolved && (
                              <button
                                className="bg-primary text-white px-2 py-1 rounded-lg hover:bg-primary/90 transition-colors text-xs"
                                onClick={() => resolveReport(r.id)}
                              >
                                Resolve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {showPendingModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">Pending Reservations</h3>
                  <button
                    onClick={() => setShowPendingModal(false)}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                {pendingReservations.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No pending reservations.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-3 px-4">ID</th>
                          <th className="text-left py-3 px-4">Tool</th>
                          <th className="text-left py-3 px-4">User</th>
                          <th className="text-left py-3 px-4">Start Date</th>
                          <th className="text-left py-3 px-4">End Date</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingReservations.map((r) => (
                          <tr key={r.id} className="border-b border-white/10">
                            <td className="py-3 px-4">{r.id}</td>
                            <td className="py-3 px-4 font-medium">{r.tool_name}</td>
                            <td className="py-3 px-4">{r.user_name || "N/A"}</td>
                            <td className="py-3 px-4">{new Date(r.start_date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{new Date(r.end_date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg hover:bg-green-500/30 transition-colors text-sm w-full sm:w-auto whitespace-nowrap"
                                  onClick={() => approveReservation(r.id)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="bg-red-500/20 text-red-300 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors text-sm w-full sm:w-auto whitespace-nowrap"
                                  onClick={() => rejectReservation(r.id)}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {showAddToolModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">Add New Tool</h3>
                  <button
                    onClick={() => setShowAddToolModal(false)}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={async (e) => {
                  e.preventDefault();

                  const formData = new FormData();
                  formData.append('name', formState.name);
                  formData.append('description', formState.description);
                  formData.append('category', formState.category);
                  // 'image' must match the name used in upload.single('image')
                  formData.append('image', formState.imageFile);

                  try {
                    // Axios will automatically set the correct headers for FormData
                    await api.post('/tools', formData);
                    addToast("Tool added successfully!");
                    setShowAddToolModal(false);
                    setFormState({ name: "", description: "", category: "", imageFile: null });
                    fetchAll();
                  } catch (err) {
                    addToast("Failed to add tool", "error");
                  }
                }}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Tool Name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={formState.description}
                      onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                      required
                    />
                    <select
                      value={formState.category}
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="" className="bg-gray-800">Select Category</option>
                      <option value="Power Tools" className="bg-gray-800">Power Tools</option>
                      <option value="Hand Tools" className="bg-gray-800">Hand Tools</option>
                      <option value="Gardening" className="bg-gray-800">Gardening</option>
                      <option value="Cleaning" className="bg-gray-800">Cleaning</option>
                      <option value="Other" className="bg-gray-800">Other</option>
                    </select>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormState({ ...formState, imageFile: e.target.files[0] })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white file:bg-primary file:text-white file:border-none file:rounded file:px-3 file:py-1 file:mr-3"
                    />
                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                      Add Tool
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
