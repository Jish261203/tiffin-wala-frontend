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
import { Button } from "./ui/button";
import { Receipt } from "lucide-react";
import { formatPrice } from "@/utils/format";
import InvoiceModal from "./InvoiceModal";

type Props = {
  orders: Order[];
  showInvoiceButton?: boolean;
  onViewInvoice?: (orderId: string) => void;
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

const OrderHistoryList = ({ orders, showInvoiceButton = true, onViewInvoice }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

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

  const calculateOrderTotal = (order: Order) => {
    if (order.totalAmount && order.totalAmount > 0) {
      return order.totalAmount;
    }
    
    const itemsTotal = order.cartItems.reduce(
      (total, item) => {
        const price = item.price || 0;
        const quantity = parseInt(item.quantity) || 1;
        return total + (price * quantity);
      },
      0
    );
    
    const deliveryPrice = order.restaurant?.deliveryPrice || 0;
    return itemsTotal + deliveryPrice;
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
        {filteredAndSortedOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {order.restaurant.restaurantName}
                </h3>
                <p className="text-gray-600">
                  Order #{order._id.substring(0, 8)}
                </p>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-2">
              {order.cartItems.map((item, index) => {
                const itemPrice = item.price || 0;
                const quantity = parseInt(item.quantity) || 1;
                const total = itemPrice * quantity;
                
                return (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>{formatPrice(total)}</span>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">
                Total: {formatPrice(calculateOrderTotal(order))}
              </div>
              {showInvoiceButton && (
                <Button
                  onClick={() => {
                    if (onViewInvoice) {
                      onViewInvoice(order._id);
                    } else {
                      setSelectedOrderId(order._id);
                    }
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Receipt size={20} />
                  View Invoice
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <InvoiceModal
        orderId={selectedOrderId || ""}
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  );
};

export default OrderHistoryList; 