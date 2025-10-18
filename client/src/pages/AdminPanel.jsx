import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const AdminPanel = () => {
  const [tools, setTools] = useState([]);
  const [reports, setReports] = useState([]);
  const [reservations, setReservations] = useState([]);

  const fetchAll = async () => {
    const t = await api.get("/tools");
    setTools(t.data);

    const r = await api.get("/reports");
    setReports(r.data);

    const res = await api.get("/reservations");
    setReservations(res.data);
  };

  const resolveReport = async (id) => {
    await api.patch(`/reports/${id}/resolve`);
    fetchAll();
  };

  const deleteTool = async (id) => {
    await api.delete(`/tools/${id}`);
    fetchAll();
  };

  const changeStatus = async (id, status) => {
    await api.patch(`/reservations/${id}/status`, { status });
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <section>
        <h3>Tools</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Category</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.category}</td>
                <td><button onClick={() => deleteTool(t.id)}>🗑️ Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Reservations</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Tool</th><th>User</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.tool_name}</td>
                <td>{r.user_name || "N/A"}</td>
                <td>{r.status}</td>
                <td>
                  <select value={r.status} onChange={(e) => changeStatus(r.id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Damage Reports</h3>
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Tool</th><th>Reporter</th><th>Description</th><th>Resolved</th><th>Action</th></tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.tool_name}</td>
                <td>{r.reporter}</td>
                <td>{r.description}</td>
                <td>{r.resolved ? "✅" : "❌"}</td>
                <td>{!r.resolved && <button onClick={() => resolveReport(r.id)}>Resolve</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminPanel;
