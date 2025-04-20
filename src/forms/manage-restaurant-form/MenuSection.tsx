import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import MenuItemInput from "./MenuItemInput";
import { FormDescription, FormField, FormItem } from "@/components/ui/form";

const MenuSection = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Menu</h2>
        <FormDescription>
          Create your menu items here. Add the name, price, and description for each item.
        </FormDescription>
      </div>

      <FormField
        control={control}
        name="menuItems"
        render={() => (
          <FormItem className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-4">
                <div className="flex-1">
                  <MenuItemInput 
                    index={index} 
                    removeMenuItem={() => remove(index)}
                  />
                </div>
              </div>
            ))}
          </FormItem>
        )}
      />

      <Button
        type="button"
        onClick={() => append({ name: "", price: 0, description: "", day: "Monday" })}
      >
        Add Menu Item
      </Button>
    </div>
  );
};

export default MenuSection;
