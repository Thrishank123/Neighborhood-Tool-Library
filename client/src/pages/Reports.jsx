import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [desc, setDesc] = useState("");
  const [toolId, setToolId] = useState("");

  const fetchReports = async () => {
    const res = await api.get("/reports").catch(() => null);
    if (res) setReports(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reports", { tool_id: toolId, description: desc });
      alert("Damage report submitted!");
      setDesc("");
      setToolId("");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting report");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Report a Damaged Tool</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <input
          type="number"
          placeholder="Tool ID"
          value={toolId}
          onChange={(e) => setToolId(e.target.value)}
        />
        <textarea
          placeholder="Describe the issue"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button type="submit">Submit Report</button>
      </form>

      {reports.length > 0 && (
        <>
          <h3>All Damage Reports (Admin only)</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tool</th>
                <th>Reporter</th>
                <th>Description</th>
                <th>Resolved</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.tool_name}</td>
                  <td>{r.reporter}</td>
                  <td>{r.description}</td>
                  <td>{r.resolved ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Reports;
