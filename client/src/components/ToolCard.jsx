import Button from "./Button";
import Card from "./Card";

const ToolCard = ({ tool, onReserve }) => {
  const img = tool.image_url
    ? `http://localhost:5000${tool.image_url}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Card className="group hover:shadow-xl transition-all duration-300">
      <div className="aspect-video mb-4 overflow-hidden rounded-lg bg-neutral-100">
        <img
          src={img}
          alt={`Image of ${tool.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
          {tool.name}
        </h3>
        <p className="text-sm text-neutral-600 mb-3 line-clamp-3">
          {tool.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {tool.category}
          </span>
          <span className="text-xs text-neutral-500">
            ID: {tool.id}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={onReserve}
          className="w-full"
          size="sm"
        >
          Reserve Tool
        </Button>
      </div>
    </Card>
  );
};

export default ToolCard;
