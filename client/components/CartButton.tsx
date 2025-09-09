import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

export const CartButton = () => {
  const { itemCount } = useCart();

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link to="/cart">
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center p-0 animate-scale-in"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
};
