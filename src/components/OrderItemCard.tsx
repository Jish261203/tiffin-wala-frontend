import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ORDER_STATUS } from "@/config/order-status-config";
import { useUpdateOrder } from "@/api/OrderApi";
import { formatPrice } from "@/utils/format";

type Props = {
  order: Order;
};

const OrderItemCard = ({ order }: Props) => {
  const { updateOrder, isLoading } = useUpdateOrder();

  const handleStatusChange = async (status: string) => {
    await updateOrder({ orderId: order._id, status });
  };

  const getTotalAmount = () => {
    const itemsTotal = order.cartItems.reduce((total, item) => {
      const menuItem = order.restaurant.menuItems.find(
        (mi) => mi._id === item.menuItemId
      );
      const quantity = parseInt(item.quantity) || 0;
      return total + (menuItem?.price || 0) * quantity;
    }, 0);
    return itemsTotal + (order.restaurant.deliveryPrice || 0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex gap-2">
            <span>Order from {order.restaurant?.restaurantName || 'Unknown Restaurant'}</span>
            <Badge>{order.status}</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="status">Status:</Label>
            <Select
              defaultValue={order.status}
              onValueChange={handleStatusChange}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Items</h3>
          {order.cartItems.map((item) => {
            const menuItem = order.restaurant.menuItems.find(
              (mi) => mi._id === item.menuItemId
            );
            const quantity = parseInt(item.quantity) || 0;
            const itemPrice = menuItem?.price || 0;
            
            return (
              <div key={item.menuItemId} className="flex justify-between">
                <span>
                  {item.name} x {quantity}
                </span>
                <span>{formatPrice(itemPrice * quantity)}</span>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Delivery Details</h3>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{formatPrice(order.restaurant.deliveryPrice || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">{formatPrice(getTotalAmount())}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemCard;
