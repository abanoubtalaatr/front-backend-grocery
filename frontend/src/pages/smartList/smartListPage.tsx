import { AddingButton } from "@/components/ui/AddingButton";

import {
  SmartListCard,
  AddSmartCartDialog,
  useSmartListManagement,
  DeleteSmartListDialog,
  FavoriteHeader,
} from "@/features/smartList";

export default function SmartListPage() {
  const smartListManagement = useSmartListManagement();
  const smartLists = Array.isArray(smartListManagement.smartLists)
    ? smartListManagement.smartLists
    : [];

  return (
    <>
      <AddSmartCartDialog
        products={smartListManagement.products ?? []}
        open={smartListManagement.open}
        onOpenChange={smartListManagement.handleDialogOpenChange}
        existingImageUrl={smartListManagement.existingImageUrl}
        form={smartListManagement.form}
        onSubmit={smartListManagement.onSubmit}
      />

      <div>
        <AddingButton
          onClick={() => {
            smartListManagement.startCreate();
          }}
          label="Smart list"
        />
      </div>
      {smartListManagement.isLoading ? (
        <div className="mt-4">Loading...</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {smartLists.map((smartList) => (
            <SmartListCard
              key={smartList.id}
              smartList={smartList}
              onEdit={smartListManagement.openEdit}
              openDeleteDialog={smartListManagement.openDeleteDialog}
            />
          ))}

          <DeleteSmartListDialog
            open={smartListManagement.openDelete}
            onOpenChange={smartListManagement.handleDialogOpenChange}
            onCancel={smartListManagement.onCancel}
            onConfirm={() => {
              if (smartListManagement.deletingId) {
                smartListManagement.onDelete(
                  smartListManagement.deletingId as string,
                );
              }
            }}
          />
        </div>
      )}
      <div>
        <FavoriteHeader />
        <div className="mt-4 grid  grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="">
            <img
              className="w-25 h-25 object-cover rounded-2xl"
              src="https://images.unsplash.com/photo-1771132666487-3d7a048a36df"
              alt=""
            />
            <div className="flex items-center gap-2">
              <span className="text-grocery-900 font-medium text-lg">
                Product Name
              </span>
              <span className="text-grocery-500 font-medium text-sm">
                $10.00
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
