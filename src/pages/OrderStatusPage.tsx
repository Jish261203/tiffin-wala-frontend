import { useGetMyOrders } from "@/api/OrderApi";
import OrderHistoryList from "@/components/OrderHistoryList";

const OrderStatusPage = () => {
  const { orders, isLoading } = useGetMyOrders();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!orders || orders.length === 0) {
    return <span>No orders found</span>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Order History</h2>
      <OrderHistoryList orders={orders} />
    </div>
  );
};

export default OrderStatusPage;
