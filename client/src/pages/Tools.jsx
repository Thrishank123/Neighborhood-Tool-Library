import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import api from "../api/axiosConfig";
import ToolCard from "../components/ToolCard";
import Container from "../components/Container";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";

const Tools = () => {
  const navigate = useNavigate();
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
      navigate(`/reservations?tool_id=${toolId}`);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reserve tool";
      addToast(message, "error");
    }
  };
  
  const categories = [...new Set(tools.map(tool => tool.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[url('https://www.shareable.net/wp-content/uploads/2018/12/blog_top-image_tools.jpg')] bg-cover bg-center bg-no-repeat pt-24">
        <div className="mx-4 lg:mx-8 xl:mx-16 mt-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="text-center">
              <Spinner size="lg" className="mx-auto mb-4" />
              <p className="text-white/80">Loading tools...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://www.shareable.net/wp-content/uploads/2018/12/blog_top-image_tools.jpg')] bg-cover bg-center bg-no-repeat pt-24">
      <div className="mx-4 lg:mx-8 xl:mx-16 mt-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              {/* Title Section */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Available Tools
                </h1>
                <p className="text-17xl text-white/80 max-w-2xl">
                  Browse, reserve, and manage all available equipment in the inventory.
                </p>
              </div>

              {/* Controls Section */}
              <div className="flex flex-col sm:flex-row gap-4 lg:min-w-0 lg:flex-shrink-0">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-white/25 border border-white/30 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 w-full sm:w-64"
                  />
                </div>

                {/* Filter Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/25 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30"
                >
                  <option value="" className="bg-neutral-800">Filter by Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-neutral-800">{category}</option>
                  ))}
                </select>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/25 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30"
                >
                  <option value="" className="bg-neutral-800">Sort by...</option>
                  <option value="name" className="bg-neutral-800">Name</option>
                  <option value="category" className="bg-neutral-800">Category</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/80 text-lg">No tools available yet.</p>
              <p className="text-white/60 mt-2">Check back later for new additions to the library.</p>
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
        </div>
      </div>
    </div>
  );
};

export default Tools;
