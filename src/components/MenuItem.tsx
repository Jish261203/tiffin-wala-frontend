import { MenuItem as MenuItemType } from "@/types";
import { Button } from "./ui/button";
import { formatPrice } from "@/utils/format";
import { motion } from "framer-motion";
import { Plus, Minus, Heart } from "lucide-react";
import { useState } from "react";

type Props = {
  menuItem: MenuItemType;
  addToCart: () => void;
};

const MenuItem = ({ menuItem, addToCart }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex flex-col p-4 rounded-xl border border-slate-200 hover:border-orange-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md relative overflow-hidden"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsLiked(!isLiked)}
        className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300 ${
          isLiked ? "bg-red-100 text-red-500" : "bg-slate-100 text-slate-500"
        }`}
      >
        <Heart
          size={20}
          className={isLiked ? "fill-current" : ""}
        />
      </motion.button>

      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2">{menuItem.name}</h3>
        <p className="text-orange-500 font-semibold mb-4">
          {formatPrice(menuItem.price)}
        </p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {menuItem.description || "Delicious food made with love and care"}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-orange-500/5 backdrop-blur-sm flex items-center justify-center"
      >
        <Button
          onClick={addToCart}
          className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2 transition-colors duration-300 shadow-lg"
        >
          <Plus size={20} />
          Add to Cart
        </Button>
      </motion.div>

      <Button
        onClick={addToCart}
        className={`bg-orange-500 hover:bg-orange-600 flex items-center gap-2 transition-colors duration-300 ${
          isHovered ? "hidden" : ""
        }`}
      >
        <Plus size={20} />
        Add to Cart
      </Button>
    </motion.div>
  );
};

export default MenuItem;
