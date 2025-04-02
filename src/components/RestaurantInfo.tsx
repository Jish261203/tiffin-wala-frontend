import { Restaurant } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Dot } from "lucide-react";
import { formatPrice } from "@/utils/format";

type Props = {
  restaurant: Restaurant;
};

const RestaurantInfo = ({ restaurant }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">
          {restaurant.restaurantName}
        </CardTitle>
        <CardDescription>
          {restaurant.city}, {restaurant.country}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex">
        <div className="flex gap-2 text-muted-foreground">
          <span>{restaurant.cuisines.join(", ")}</span>
          <Dot />
          <span>Delivery Fee: {formatPrice(restaurant.deliveryPrice)}</span>
          <Dot />
          <span>Estimated Time: {restaurant.estimatedDeliveryTime} mins</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantInfo;
