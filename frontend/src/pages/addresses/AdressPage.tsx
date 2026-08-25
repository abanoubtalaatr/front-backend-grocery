import { Button } from "@/components/ui/Button";
import {
  AddressCard,
  AddressFormDialog,
  DeleteAddressDialog,
  useManageAddress,
} from "@/features/addresses";

export function AdressPage() {
  const manage = useManageAddress();

  if (manage.isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Button className="w-auto" onClick={manage.startCreate}>
          + Add address
        </Button>
      </div>

      <AddressFormDialog
        open={manage.open}
        onOpenChange={(isOpen) => { if (!isOpen) manage.closeForm(); }}
        onSubmit={manage.onSubmit}
        register={manage.register}
        errors={manage.errors}
        saving={manage.saving}
        title={manage.editingId ? "Edit address" : "Add address"}
      />

      <DeleteAddressDialog
        open={manage.deletingId !== null}
        onOpenChange={(isOpen) => { if (!isOpen) manage.cancelDelete(); }}
        onCancel={manage.cancelDelete}
        onConfirm={manage.confirmDelete}
      />

      <div className="mt-4 ">
        {manage.addresses.length === 0 ? (
          <p className="rounded-lg bg-grocery-50 p-4 text-sm text-grocery-700">
            No addresses yet. Click "Add address" to create one.
          </p>
        ) : (
          manage.addresses.map((address, index) => (
            <AddressCard
              key={address.id ?? address._id ?? index}
              address={address}
              onEdit={manage.startEdit}
              onDelete={manage.openDelete}
            />
          ))
        )}
      </div>
    </>
  );
}
