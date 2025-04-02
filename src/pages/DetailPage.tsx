import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetRestaurant } from "@/api/RestaurantApi";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";
import { MenuItem as MenuItemType } from "@/types";
import { useCreateCheckoutSession } from "@/api/OrderApi";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, ShoppingCart } from "lucide-react";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const { restaurant, isLoading } = useGetRestaurant(restaurantId, selectedDay);
  const { createCheckoutSession } = useCreateCheckoutSession();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id
      );

      let updatedCartItems;

      if (existingCartItem) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => cartItem._id !== item._id
      );

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) {
      return;
    }

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ) + restaurant.deliveryPrice;

    const checkoutData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
        price: cartItem.price,
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: userFormData.name,
        addressLine1: userFormData.addressLine1,
        city: userFormData.city,
        country: userFormData.country,
        email: userFormData.email as string,
      },
      totalAmount: totalAmount,
    };

    const data = await createCheckoutSession(checkoutData);
    window.location.href = data.url;
  };

  const getTotalCost = (cartItems: CartItem[]) => {
    const totalCost = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    return totalCost;
  };

  if (isLoading || !restaurant) {
    return (
      <div className="flex flex-col gap-10 p-4 md:p-8">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="grid md:grid-cols-[4fr_2fr] gap-5">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[40px] w-[200px] rounded-lg" />
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-[200px] w-full rounded-lg" />
              ))}
            </div>
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-10 p-4 md:p-8"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <AspectRatio ratio={16 / 5}>
          <img
            src={restaurant.imageUrl}
            className="rounded-xl object-cover h-full w-full shadow-lg"
            alt={restaurant.restaurantName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{restaurant.restaurantName}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CalendarDays size={16} />
                <span>{restaurant.cuisines.join(", ")}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{restaurant.estimatedDeliveryTime} mins</span>
              </div>
            </div>
          </div>
        </AspectRatio>
      </motion.div>

      <div className="grid md:grid-cols-[4fr_2fr] gap-5">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <RestaurantInfo restaurant={restaurant} />
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Menu</h2>
            <div className="flex items-center gap-2">
              <CalendarDays className="text-orange-500" size={20} />
              <Select
                value={selectedDay}
                onValueChange={(value) => setSelectedDay(value)}
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {restaurant.menuItems.map((menuItem, index) => (
              <motion.div
                key={menuItem._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <MenuItem
                  menuItem={menuItem}
                  addToCart={() => addToCart(menuItem)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <OrderSummary
            restaurant={restaurant}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
          />
          <div className="sticky top-4 space-y-4 bg-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Total Cost</h3>
              <h3 className="font-bold text-lg text-orange-500">
                {formatPrice(getTotalCost(cartItems))}
              </h3>
            </div>
            <Button
              onClick={() => onCheckout({} as UserFormData)}
              disabled={cartItems.length === 0}
              className="w-full bg-orange-500 hover:bg-orange-600 h-12 text-lg"
            >
              <ShoppingCart className="mr-2" size={20} />
              {cartItems.length > 0 ? `Checkout (${cartItems.length})` : "Checkout"}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DetailPage;
