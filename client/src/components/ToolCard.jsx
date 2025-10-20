import Button from "./Button";
import Card from "./Card";

const ToolCard = ({ tool, onReserve }) => {
  const img = tool.image_url
    ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${tool.image_url}`
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
    <Card className="rounded-xl overflow-hidden">
      <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-neutral-100">
          <img
          src={img}
          alt={`Image of ${tool.name}`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-xl md:text-2xl font-bold text-black mb-2 line-clamp-2">
          {tool.name}
        </h3>

        {/* Status Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        <div className="space-y-1 mb-4">
          <p className="text-xs text-black">
            ID: {tool.id}
          </p>
          <p className="text-xs text-black">
            Category: {tool.category}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={onReserve}
          size="sm"
        >
          Reserve
        </Button>
      </div>
    </Card>
  );
};

export default ToolCard;
