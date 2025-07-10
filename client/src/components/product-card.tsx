import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import type { Content } from "@shared/schema";

interface ProductCardProps {
  content: Content;
}

export default function ProductCard({ content }: ProductCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "course":
        return "bg-accent/10 text-accent";
      case "game":
        return "bg-warning/10 text-warning";
      case "design":
        return "bg-purple-100 text-purple-600";
      case "document":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={content.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"}
        alt={content.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(content.category)}>
            {content.category}
          </Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{content.rating}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{content.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{content.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-gray-600">Creator #{content.creatorId}</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">${content.pricePerMinute}/min</div>
            <div className="text-sm text-gray-500">streaming</div>
          </div>
        </div>
        
        <Link href={`/product/${content.id}`}>
          <Button className="w-full gradient-primary text-white hover:opacity-90 transition-opacity">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
