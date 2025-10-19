import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import api from "../api/axiosConfig";
import ToolCard from "../components/ToolCard";
import Container from "../components/Container";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

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
        setFilteredTools(res.data);
      } catch (err) {
        setError("Failed to load tools. Please try again.");
        addToast("Failed to load tools", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  useEffect(() => {
    let filtered = tools.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category") {
      filtered = filtered.sort((a, b) => a.category.localeCompare(b.category));
    }

    setFilteredTools(filtered);
  }, [tools, searchTerm, selectedCategory, sortBy]);

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

  const categories = [...new Set(tools.map(tool => tool.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <Container className="py-12">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-neutral-600">Loading tools...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <Container className="py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Available Tools
              </h1>
              <p className="text-lg text-neutral-600 max-w-2xl">
                Browse, reserve, and manage all available equipment in the inventory.
              </p>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col sm:flex-row gap-4 lg:min-w-0 lg:flex-shrink-0">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full sm:w-64"
                />
              </div>

              {/* Filter Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              >
                <option value="">Filter by Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              >
                <option value="">Sort by...</option>
                <option value="name">Name</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
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
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-lg">No tools available yet.</p>
            <p className="text-neutral-400 mt-2">Check back later for new additions to the library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTools.map((tool) => (
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
    </div>
  );
};

export default Tools;
