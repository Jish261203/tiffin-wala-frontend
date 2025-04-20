// Format price from paise to rupees with proper formatting
export const formatPrice = (price: number): string => {
  if (isNaN(price) || price === null || price === undefined) {
    return "₹0";
  }
  
  // If the price is in paise (Backend uses paise, frontend expects rupees)
  // Most menu items and prices are likely above 100, so we can detect if it's in paise
  const finalPrice = price > 1000 && price % 100 === 0 ? price / 100 : price;
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(finalPrice);
}; 