import { Restaurant } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatPrice } from "@/utils/format";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Props = {
  restaurant: Restaurant;
  cartItems: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  removeFromCart: (cartItem: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }) => void;
};

const OrderSummary = ({ restaurant, cartItems, removeFromCart }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getTotalCost = () => {
    const itemsTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return itemsTotal + restaurant.deliveryPrice;
  };

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Your Order</span>
            {cartItems.length > 0 && (
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm">
                {cartItems.length} items
              </span>
            )}
          </div>
          <span className="text-orange-500">
            {formatPrice(getTotalCost())}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <AnimatePresence>
          {cartItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-orange-100 hover:text-orange-500"
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="font-semibold">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-orange-100 hover:text-orange-500"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <p className="text-sm text-gray-500">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-orange-500">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item)}
                  className="h-8 w-8 hover:bg-red-100 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {cartItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <X size={40} className="text-gray-300" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add some delicious items to your cart!</p>
            </div>
          </motion.div>
        )}
        <div className="flex flex-col gap-2 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">
              {formatPrice(getTotalCost() - restaurant.deliveryPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-semibold text-orange-500">
              {formatPrice(restaurant.deliveryPrice)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-bold">Total</span>
            <span className="font-bold text-orange-500">
              {formatPrice(getTotalCost())}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
