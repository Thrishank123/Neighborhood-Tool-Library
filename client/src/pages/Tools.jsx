import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import ToolCard from "../components/ToolCard";
import Container from "../components/Container";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await api.get("/tools");
        setTools(res.data);
      } catch (err) {
        setError("Failed to load tools. Please try again.");
        addToast("Failed to load tools", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleReserve = async (toolId) => {
    try {
      await api.post("/reservations", {
        tool_id: toolId,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      });
      addToast("Reservation request submitted successfully!");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reserve tool";
      addToast(message, "error");
    }
  };

  if (isLoading) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-neutral-600">Loading tools...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Available Tools</h1>
        <p className="text-neutral-600">Browse and reserve tools from your neighborhood library</p>
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 text-lg">No tools available yet.</p>
          <p className="text-neutral-400 mt-2">Check back later for new additions to the library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onReserve={() => handleReserve(tool.id)}
            />
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Container>
  );
};

export default Tools;
