import { SearchState } from "@/pages/SearchPage";
import { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurant = (restaurantId?: string, day?: string) => {
  const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
    const params = new URLSearchParams();
    if (day) {
      params.set("day", day);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/${restaurantId}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to get restaurant");
    }

    return response.json();
  };

  const { data: restaurant, isLoading } = useQuery(
    ["fetchRestaurant", restaurantId, day],
    getRestaurantByIdRequest,
    {
      enabled: !!restaurantId,
    }
  );

  return { restaurant, isLoading };
};

export const useSearchRestaurants = (city?: string) => {
  const { getAccessTokenSilently } = useAuth0();

  const searchRestaurantsRequest = async (): Promise<RestaurantSearchResponse> => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${API_BASE_URL}/api/restaurant/search/${city}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to search restaurants");
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          throw new Error("Network error. Please check your internet connection.");
        }
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  };

  const {
    data: results,
    isLoading,
    error,
  } = useQuery(["searchRestaurants", city], searchRestaurantsRequest, {
    enabled: !!city,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (error) {
    toast.error(error.toString());
  }

  return { results, isLoading };
};
