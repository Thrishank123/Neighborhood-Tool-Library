import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ tool_id: "", start_date: "", end_date: "" });

  const fetchReservations = async () => {
    const res = await api.get("/reservations");
    setReservations(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reservations", form);
      alert("Reservation requested successfully!");
      fetchReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Reservation failed");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div>
      <h2>My Reservations</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <input
          type="number"
          placeholder="Tool ID"
          value={form.tool_id}
          onChange={(e) => setForm({ ...form, tool_id: e.target.value })}
        />
        <input
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        />
        <button type="submit">Reserve Tool</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tool</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
          </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.tool_name}</td>
              <td>{r.start_date}</td>
              <td>{r.end_date}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reservations;
