import {
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cuisineList, comboMeals } from "@/config/restaurant-options-config";
import { useFormContext } from "react-hook-form";
import CuisineCheckbox from "./CuisineCheckbox";

const CuisinesSection = () => {
  const { control, watch } = useFormContext();
  
  // Watch the "cuisines" field to check if "Combo Meal" is selected
  const selectedCuisines = watch("cuisines") || [];

  return (
    <div className="space-y-4">
      {/* Cuisine Section */}
      <div>
        <h2 className="text-2xl font-bold">Cuisines</h2>
        <FormDescription>Select the cuisines that your tiffin serves</FormDescription>
      </div>
      <FormField
        control={control}
        name="cuisines"
        render={({ field }) => (
          <FormItem>
            <div className="grid md:grid-cols-5 gap-1">
              {cuisineList.map((cuisineItem) => (
                <CuisineCheckbox key={cuisineItem} cuisine={cuisineItem} field={field} />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Show Combo Meals only if "Combo Meal" is selected */}
      {selectedCuisines.includes("Combo Meal") && (
        <div>
          <h2 className="text-xl font-semibold">Combo Meals</h2>
          <FormDescription>Select the combo meals your tiffin offers</FormDescription>

          <FormField
            control={control}
            name="comboMeals"
            render={({ field }) => (
              <FormItem>
                <div className="grid md:grid-cols-3 gap-1">
                  {comboMeals.map((combo) => (
                    <CuisineCheckbox key={combo} cuisine={combo} field={field} />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default CuisinesSection;
