import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Controller, type UseFormReturn } from "react-hook-form";
import { MultiSelectField } from "@/components/ui/MultiSelectField";
import type { ProductOption } from "../types";
import type { SmartListValues } from "../schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: ProductOption[];
  /** Server image URL when editing (form `image` stays unset until user picks a new file). */
  existingImageUrl?: string | null;
  /** Must come from the same `useSmartListManagement()` instance as the page (single hook tree). */
  form: UseFormReturn<SmartListValues>;
  onSubmit: ReturnType<UseFormReturn<SmartListValues>["handleSubmit"]>;
};

export function AddSmartCartDialog({
  open,
  onOpenChange,
  products = [],
  existingImageUrl = null,
  form,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Smart Cart</DialogTitle>
          <DialogDescription> Enter the details of the smart cart below. </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <TextField
            id="name"
            label="Name"
            className="my-4"
            placeholder="Enter the name of the smart cart"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-red-500">{form.formState.errors.name.message}</p>
          )}
          <Controller
            control={form.control}
            name="image"
            render={({ field, fieldState }) => (
              <ImageUpload
                label="Image"
                hint="PNG, JPG, WebP, or GIF"
                file={field.value ?? null}
                onFileChange={(file) => field.onChange(file ?? undefined)}
                error={fieldState.error?.message}
                maxSize={5 * 1024 * 1024}
                existingImageUrl={existingImageUrl}
              />
            )}
          />
          
          <Controller
            control={form.control}
            name="items"
            render={({ field, fieldState }) => (
              <MultiSelectField
                id="items"
                label="Items"
                placeholder="Select the items of the smart list"
                options={(Array.isArray(products) ? products : []).map(
                  (product) => ({
                    value: product.id,
                    label: product.name,
                  })
                )}
                value={field.value ?? []}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <div className="mt-4 space-y-2">
            
            </div>
          <Button type="submit" loading={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Adding..." : "Add Smart List"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
