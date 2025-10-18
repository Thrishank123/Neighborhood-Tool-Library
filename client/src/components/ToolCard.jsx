const ToolCard = ({ tool }) => {
  const img = tool.image_url
    ? `http://localhost:5000${tool.image_url}`
    : "https://via.placeholder.com/150";

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition">
      <img src={img} alt={tool.name} className="w-32 h-32 object-contain mb-3 rounded" />
      <h3 className="text-lg font-semibold">{tool.name}</h3>
      <p className="text-sm text-gray-500 text-center">{tool.description}</p>
      <span className="text-xs mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
        {tool.category}
      </span>
    </div>
  );
};

export default ToolCard;
