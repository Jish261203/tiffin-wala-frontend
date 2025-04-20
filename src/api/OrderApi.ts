import { Order } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { apiClient, updateAuthToken } from "../services/apiClient";

export const useGetMyOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const { data: orders, isLoading } = useQuery(
    "fetchMyOrders",
    async () => {
      const token = await getAccessTokenSilently();
      updateAuthToken(token);
      const response = await apiClient.get("/api/order");
      
      // Make sure the received data has valid prices
      if (response.data && Array.isArray(response.data)) {
        return response.data.map(order => ({
          ...order,
          cartItems: order.cartItems.map(item => ({
            ...item,
            price: typeof item.price === 'number' ? item.price : 0,
            quantity: item.quantity || '1'
          })),
          totalAmount: typeof order.totalAmount === 'number' ? order.totalAmount : 0
        }));
      }
      
      return response.data;
    },
    {
      refetchInterval: 5000,
    }
  );

  return { orders, isLoading };
};

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
    price: number;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
    country: string;
  };
  restaurantId: string;
  totalAmount: number;
};

export const useCreateCheckoutSession = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createCheckoutSessionRequest = async (
    checkoutSessionRequest: CheckoutSessionRequest
  ) => {
    try {
      const token = await getAccessTokenSilently();
      updateAuthToken(token);
      const response = await apiClient.post(
        "/api/order/checkout/create-checkout-session",
        checkoutSessionRequest
      );

      if (!response.data) {
        throw new Error("Unable to create checkout session");
      }

      return response.data;
    } catch (error: any) {
      if (error.message?.includes("Failed to fetch")) {
        throw new Error(
          "Unable to connect to the server. Please make sure the backend is running and accessible."
        );
      }
      throw error;
    }
  };

  const {
    mutateAsync: createCheckoutSession,
    isLoading,
    error,
    reset,
  } = useMutation(createCheckoutSessionRequest, {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onMutate: () => {
      // Disable the checkout button while processing
      return { isProcessing: true };
    },
    onError: (error) => {
      toast.error(error.toString());
      reset();
    },
    onSettled: () => {
      // Re-enable the checkout button
      return { isProcessing: false };
    }
  });

  return { createCheckoutSession, isLoading };
};

export const useUpdateOrder = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateOrderRequest = async (updateData: {
    orderId: string;
    status: string;
  }) => {
    const token = await getAccessTokenSilently();
    updateAuthToken(token);
    const response = await apiClient.patch(
      `/api/order/${updateData.orderId}/status`,
      { status: updateData.status }
    );

    if (!response.data) {
      throw new Error("Failed to update order status");
    }

    return response.data;
  };

  const {
    mutateAsync: updateOrder,
    isLoading,
    error,
    reset,
  } = useMutation(updateOrderRequest);

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return { updateOrder, isLoading };
};

export const useGetInvoice = (orderId: string) => {
  const { getAccessTokenSilently } = useAuth0();

  const { data: invoiceData, isLoading, error } = useQuery(
    [`invoice-${orderId}`, orderId],
    async () => {
      try {
        if (!orderId) return null;
        
        const token = await getAccessTokenSilently();
        updateAuthToken(token);
        
        const response = await apiClient.get(`/api/order/${orderId}/invoice`);
        console.log("Invoice data received:", response.data);
        
        // Format prices in the response for proper display
        if (response.data) {
          const formattedData = {
            ...response.data,
            items: response.data.items.map((item: any) => ({
              ...item,
              price: item.price || 0, // Ensure price is not null or undefined
              total: (item.price || 0) * (item.quantity || 1) // Recalculate total
            })),
            subtotal: response.data.subtotal || 0,
            deliveryFee: response.data.deliveryFee || 0,
            totalAmount: response.data.totalAmount || 0
          };
          return formattedData;
        }
        
        return response.data;
      } catch (error) {
        console.error("Error fetching invoice:", error);
        throw error;
      }
    },
    {
      enabled: !!orderId,
      refetchOnWindowFocus: false
    }
  );

  if (error) {
    console.error("Invoice error:", error);
  }

  return { invoiceData, isLoading, error };
}; 