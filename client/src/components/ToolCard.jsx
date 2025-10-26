import Button from "./Button";
import Card from "./Card";

const ToolCard = ({ tool, onReserve, user }) => {
  // --- THIS IS THE FIX ---
  // Use the image_url directly from the tool object if it exists.
  // It's already a complete URL from Cloudinary.
  const img = tool.image_url || "https://via.placeholder.com/300x200?text=No+Image";

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

  // Check if the user is an admin who owns this tool
  const isOwnTool = user && user.role === 'admin' && tool.admin_id === user.id;
  const canReserve = status === 'Available' && !isOwnTool;

  return (
    <Card className="rounded-xl overflow-hidden p-1">
      <div className="aspect-square mb-1 overflow-hidden rounded-lg bg-neutral-100 p-0.5">
          <img
          src={img}
          alt={`Image of ${tool.name}`}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-xs font-bold text-black mb-0.5 line-clamp-2">
          {tool.name}
        </h3>

        {/* Status Badge */}
        <div className="mb-0.5">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        <div className="space-y-0.5 mb-1">
          <p className="text-xs text-black">
            ID: {tool.id}
          </p>
          <p className="text-xs text-black">
            Category: {tool.category}
          </p>
        </div>
      </div>

      <div className="mt-1">
        <Button
          onClick={onReserve}
          size="sm"
          className="px-1 py-0.5 text-xs"
          disabled={!canReserve}
          title={isOwnTool ? "You cannot reserve your own tools" : ""}
        >
          {isOwnTool ? "Owned" : "Reserve"}
        </Button>
      </div>
    </Card>
  );
};

export default ToolCard;

  