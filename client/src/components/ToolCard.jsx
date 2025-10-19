import Button from "./Button";
import Card from "./Card";

const ToolCard = ({ tool, onReserve }) => {
  const img = tool.image_url
    ? `http://localhost:5000${tool.image_url}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  // Status now comes from the API response
  const status = tool.status || 'Available';

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'In Use':
        return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden relative">
      <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-neutral-100">
          <img  
          src={img}
          alt={`Image of ${tool.name}`}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {tool.name}
        </h3>

        {/* Status Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        <div className="space-y-1 mb-4">
          <p className="text-xs text-white/60">
            ID: {tool.id}
          </p>
          <p className="text-xs text-white/60">
            Category: {tool.category}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={onReserve}
          className="w-full"
          size="sm"
        >
          Reserve
        </Button>
      </div>

      {/* Hover overlay with "View" button */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
        <button
          onClick={onReserve}
          className="bg-white text-neutral-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          View Details
        </button>
      </div>
    </Card>
  );
};

export default ToolCard;
