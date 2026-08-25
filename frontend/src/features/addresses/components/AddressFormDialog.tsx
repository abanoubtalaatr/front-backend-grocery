import { Button } from "@/components/ui/Button";
import { TextAreaField } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CreateAddressValues } from "@/features/addresses/schema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<CreateAddressValues>;
  errors: FieldErrors<CreateAddressValues>;
  saving: boolean;
  title?: string;
  description?: string;
};

export function AddressFormDialog({
  open,
  onOpenChange,
  onSubmit,
  register,
  errors,
  saving,
  title = "Add address",
  description = "Enter your address details below.",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <TextField label="Full name" {...register("full_name")} />
            {errors.full_name?.message && (
              <p className="text-xs text-red-600">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <TextField label="City" {...register("city")} />
            {errors.city?.message && (
              <p className="text-xs text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <TextField label="Phone" type="tel" {...register("phone")} />
            {errors.phone?.message && (
              <p className="text-xs text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <TextField label="Street Address" {...register("street_address")} />
            {errors.street_address?.message && (
              <p className="text-xs text-red-600">
                {errors.street_address.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <TextAreaField label="Address" rows={3} {...register("address")} />
            {errors.address?.message && (
              <p className="text-xs text-red-600">{errors.address.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              loading={saving}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

