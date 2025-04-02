import { MenuItem as MenuItemType } from "@/types";
import { Button } from "./ui/button";
import { formatPrice } from "@/utils/format";

type Props = {
  menuItem: MenuItemType;
  addToCart: () => void;
};

const MenuItem = ({ menuItem, addToCart }: Props) => {
  return (
    <div className="flex flex-col p-3 rounded-lg border border-slate-300 hover:border-orange-500 transition">
      <div className="flex-1">
        <p className="text-xl font-bold">{menuItem.name}</p>
        <p className="text-sm text-gray-600">{formatPrice(menuItem.price)}</p>
      </div>
      <Button
        onClick={addToCart}
        className="bg-orange-500 flex items-center gap-2"
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default MenuItem;
