import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axiosConfig";
import { ToastContainer } from "../components/Toast";

const Reservations = () => {
  const location = useLocation();
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ tool_id: "", start_date: "", end_date: "" });
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchReservations = async () => {
    const res = await api.get("/reservations");
    setReservations(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reservations", form);
      addToast("Reservation requested successfully!");
      fetchReservations();
    } catch (err) {
      addToast(err.response?.data?.message || "Reservation failed", "error");
    }
  };

  const handleReturn = async (reservationId) => {
    try {
      await api.patch(`/reservations/${reservationId}/return`);
      addToast("Tool returned successfully!");
      fetchReservations();
    } catch (err) {
      addToast(err.response?.data?.message || "Return failed", "error");
    }
  };

  const handleCancel = async (reservationId) => {
    try {
      await api.patch(`/reservations/${reservationId}/return`);
      addToast("Reservation cancelled successfully!");
      fetchReservations();
    } catch (err) {
      addToast(err.response?.data?.message || "Cancel failed", "error");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const toolId = params.get('tool_id');
    if (toolId) {
      setForm(prev => ({ ...prev, tool_id: toolId }));
    }
  }, [location.search]);

  return (
    <div className="pt-24">
      <div className="mx-4 lg:mx-8 xl:mx-16">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-6">My Reservations</h2>
          <div className="bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-3">Request a Reservation</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className="block text-white text-xs font-medium mb-1">Tool ID</label>
                <input
                  type="number"
                  placeholder="Enter Tool ID"
                  value={form.tool_id}
                  onChange={(e) => setForm({ ...form, tool_id: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-xs font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-xs font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
                  required
                />
              </div>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors w-full whitespace-nowrap">
                Reserve Tool
              </button>
            </form>
          </div>

          <div className="bg-black/50 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Your Reservations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-2 px-3 text-xs">ID</th>
                    <th className="text-left py-2 px-3 text-xs">Tool</th>
                    <th className="text-left py-2 px-3 text-xs">Start</th>
                    <th className="text-left py-2 px-3 text-xs">End</th>
                    <th className="text-left py-2 px-3 text-xs">Status</th>
                    <th className="text-left py-2 px-3 text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} className="border-b border-white/10">
                      <td className="py-2 px-3 text-xs">{r.id}</td>
                      <td className="py-2 px-3 text-xs">{r.tool_name}</td>
                      <td className="py-2 px-3 text-xs">{new Date(r.start_date).toLocaleDateString()}</td>
                      <td className="py-2 px-3 text-xs">{new Date(r.end_date).toLocaleDateString()}</td>
                      <td className="py-2 px-3 text-xs">{r.status}</td>
                      <td className="py-2 px-3">
                        {(r.status === 'active' || r.status === 'approved') && (
                          <div className="flex flex-col sm:flex-row gap-1">
                            <button
                              onClick={() => handleReturn(r.id)}
                              className="bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30 transition-colors text-xs w-full sm:w-auto whitespace-nowrap"
                            >
                              Return
                            </button>
                            <button
                              onClick={() => handleCancel(r.id)}
                              className="bg-red-500/20 text-red-200 px-3 py-1 rounded-lg hover:bg-red-500/30 transition-colors text-xs w-full sm:w-auto whitespace-nowrap"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </div>
    </div>
  );
};

export default Reservations;
