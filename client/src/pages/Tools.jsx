import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import ToolCard from "../components/ToolCard";

const Tools = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    api.get("/tools").then(res => setTools(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-primary">Available Tools</h2>
      {tools.length === 0 ? (
        <p className="text-gray-500">No tools available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map(t => <ToolCard key={t.id} tool={t} />)}
        </div>
      )}
    </div>
  );
};

export default Tools;
