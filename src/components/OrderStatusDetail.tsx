import { Order } from "@/types";
import { Separator } from "./ui/separator";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
  const orderDate = new Date(order.createdAt).toLocaleString();
  const subtotal = order.cartItems.reduce((total, item) => {
    const price = parseFloat(item.quantity) * (order.restaurant.menuItems.find(
      menuItem => menuItem._id === item.menuItemId
    )?.price || 0);
    return total + price;
  }, 0);
  const deliveryFee = order.restaurant.deliveryPrice;
  const total = order.totalAmount || (subtotal + deliveryFee);

  return (
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="font-bold">Order Date:</span>
        <span>{orderDate}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">Delivering to:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>
          {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <ul className="list-disc pl-4">
          {order.cartItems.map((item) => {
            const menuItem = order.restaurant.menuItems.find(
              mi => mi._id === item.menuItemId
            );
            const itemTotal = parseFloat(item.quantity) * (menuItem?.price || 0);
            return (
              <li key={item.menuItemId} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>£{(itemTotal / 100).toFixed(2)}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>£{(subtotal / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery Fee:</span>
          <span>£{(deliveryFee / 100).toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>£{(total / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusDetail;
