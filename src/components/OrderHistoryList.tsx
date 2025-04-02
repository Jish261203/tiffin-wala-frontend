import { Order, OrderStatus } from "@/types";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

type Props = {
  orders: Order[];
};

const ORDER_STATUS_LIST: OrderStatus[] = [
  "placed",
  "paid",
  "inProgress",
  "outForDelivery",
  "delivered",
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Price: High to Low", value: "priceDesc" },
  { label: "Price: Low to High", value: "priceAsc" },
];

// Format price from paise to rupees with proper formatting
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

const calculateOrderTotal = (order: Order): number => {
  const itemsTotal = order.cartItems.reduce((total, item) => {
    const menuItem = order.restaurant.menuItems.find(
      (mi) => mi._id === item.menuItemId
    );
    const quantity = parseInt(item.quantity) || 0;
    const price = menuItem?.price || 0;
    return total + (quantity * price);
  }, 0);

  return itemsTotal + (order.restaurant.deliveryPrice || 0);
};

const OrderHistoryList = ({ orders }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [sortOption, setSortOption] = useState("newest");

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return "bg-yellow-200 text-yellow-700";
      case "paid":
        return "bg-blue-200 text-blue-700";
      case "inProgress":
        return "bg-orange-200 text-orange-700";
      case "outForDelivery":
        return "bg-purple-200 text-purple-700";
      case "delivered":
        return "bg-green-200 text-green-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const filteredAndSortedOrders = orders
    .filter((order) => selectedStatus === "all" || order.status === selectedStatus)
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "priceDesc":
          return calculateOrderTotal(b) - calculateOrderTotal(a);
        case "priceAsc":
          return calculateOrderTotal(a) - calculateOrderTotal(b);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Filter by Status:</span>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {ORDER_STATUS_LIST.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedOrders.map((order) => {
          const orderTotal = calculateOrderTotal(order);
          
          return (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-4 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">
                    {order.restaurant.restaurantName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                {order.cartItems.map((item) => {
                  const menuItem = order.restaurant.menuItems.find(
                    (mi) => mi._id === item.menuItemId
                  );
                  const quantity = parseInt(item.quantity) || 0;
                  const price = menuItem?.price || 0;
                  const itemTotal = quantity * price;

                  return (
                    <div key={item.menuItemId} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatPrice(itemTotal)}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(order.restaurant.deliveryPrice || 0)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <p>Delivery to: {order.deliveryDetails.addressLine1}</p>
                  <p>{order.deliveryDetails.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount:</p>
                  <p className="font-bold">
                    {formatPrice(orderTotal)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAndSortedOrders.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No orders found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryList; 