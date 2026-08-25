import { HomeIcon, PencilIcon, TrashIcon } from "@/components/ui/FormIcons";
import type { Address } from "@/features/addresses/types";

type Props = {
  address: Address;
  onEdit: (id: string | number | undefined) => void;
  onDelete: (id: string | number | undefined) => void;
};

export function AddressCard({ address, onEdit, onDelete }: Props) {
  return (
    <div className="flex w-full flex-col rounded-lg bg-[#F7FCFF] ">
      <div className="w-full p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HomeIcon />
            <h6 className="text-sm font-medium">{address.title ?? "Home"}</h6>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(address.id)}
              className="flex items-center gap-2 rounded-md bg-[#BCB8B1] p-2 text-sm text-[#0E1112]"
              type="button"
            >
              <PencilIcon />
              Edit
            </button>
            <button
              onClick={() => onDelete(address.id)}
              className="flex items-center gap-2 rounded-md bg-[#BCB8B1] p-2 text-sm text-[#0E1112]"
              type="button"
            >
              <TrashIcon />
              Delete
            </button>
          </div>
        </div>

        <div className="mt-4 w-full">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-grocery-600">
              {[address.full_name, address.street_address, address.city]
                .filter(Boolean)
                .join(", ") || "-"}
            </p>
            <p className="text-sm text-grocery-600">{address.phone ?? "-"}</p>
          </div>
        </div>

        <div className="mt-4 w-full">
          <div className="flex flex-col gap-2 rounded-md bg-[#E5E4E4] p-2">
            <h6 className="text-sm font-medium text-[#0E1112]">
              Delivery Instructions
            </h6>
            <p className="text-sm text-grocery-600">
              {address.instructions ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

