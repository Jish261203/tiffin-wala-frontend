import { Restaurant } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Dot, Star, Clock, Truck } from "lucide-react";
import { formatPrice } from "@/utils/format";
import { motion } from "framer-motion";

type Props = {
  restaurant: Restaurant;
};

const RestaurantInfo = ({ restaurant }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {restaurant.restaurantName}
            </CardTitle>
            <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
              <Star size={16} className="fill-orange-500" />
              <span className="font-semibold">4.5</span>
            </div>
          </div>
          <CardDescription className="text-lg">
            {restaurant.city}, {restaurant.country}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
              <Truck className="text-orange-500" size={18} />
              <span>Delivery Fee: {formatPrice(restaurant.deliveryPrice)}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
              <Clock className="text-orange-500" size={18} />
              <span>Estimated Time: {restaurant.estimatedDeliveryTime} mins</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
              <Dot className="text-orange-500" size={18} />
              <span>{restaurant.cuisines.join(", ")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RestaurantInfo;
