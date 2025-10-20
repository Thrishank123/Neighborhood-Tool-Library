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
    <div className="min-h-screen bg-[url('https://www.shareable.net/wp-content/uploads/2018/12/blog_top-image_tools.jpg')] bg-cover bg-center bg-no-repeat pt-24">
      <div className="mx-4 lg:mx-8 xl:mx-16 mt-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">My Reservations</h2>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Request a Reservation</h3>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
              <div className="md:col-span-2">
                <input
                  type="number"
                  placeholder="Tool ID"
                  value={form.tool_id}
                  onChange={(e) => setForm({ ...form, tool_id: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
                />
              </div>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
              />
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
              />
              <div className="md:col-span-2">
                <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full md:w-auto">Reserve Tool</button>
              </div>
            </form>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Your Reservations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Tool</th>
                    <th className="text-left py-3 px-4">Start</th>
                    <th className="text-left py-3 px-4">End</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} className="border-b border-white/10">
                      <td className="py-3 px-4">{r.id}</td>
                      <td className="py-3 px-4">{r.tool_name}</td>
                      <td className="py-3 px-4">{new Date(r.start_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{new Date(r.end_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{r.status}</td>
                      <td className="py-3 px-4">
                        {r.status === 'active' && (
                          <button
                            onClick={() => handleReturn(r.id)}
                            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm"
                          >
                            Return
                          </button>
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
