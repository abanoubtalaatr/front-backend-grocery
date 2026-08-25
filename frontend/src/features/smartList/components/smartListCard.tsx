import { CarIcon, PencilIcon, TrashIcon } from "@/components/ui/FormIcons";
import type { SmartList } from "../types";
import { formatDistanceToNow } from "../utils/relativeTime";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1771132666487-3d7a048a36df";

export function SmartListCard({ smartList, onEdit, openDeleteDialog }: { smartList: SmartList, onEdit: (id: string) => void, openDeleteDialog: (id: string) => void }) {
  const coverSrc = smartList.image_url?.trim() || FALLBACK_IMAGE;
  const itemCount = smartList.items?.length ?? 0;

  return (
    <div className="min-w-0 w-full rounded-lg border border-grocery-200 p-5 shadow-sm">
      <div className="flex justify-between gap-2">
        <div className="flex min-w-0 gap-3">
          <img
            className="h-15 w-15 shrink-0 rounded-2xl object-cover"
            src={coverSrc}
            alt=""
          />

          <div className="flex min-w-0 flex-col justify-between">
            <h4 className="truncate">{smartList.name}</h4>
            <p>{itemCount} items</p>
          </div>
        </div>

        <TrashIcon onClick={() => {openDeleteDialog(smartList.id)}} className="size-6 shrink-0" />
      </div>
      <div className="my-4">
        Updated {formatDistanceToNow(smartList.updatedAt)}
      </div>
      <div className="flex w-full gap-2">
        <button
          type="button"
          className="flex w-3/4 items-center justify-center gap-2 rounded-md bg-grocery-900 px-4 py-2 text-white"
        >
          <CarIcon />
          Add All to cart
        </button>

        <button
           onClick={() => {onEdit(smartList.id)}}
          type="button"
          className="flex w-1/4 items-center justify-center gap-2 rounded-md border border-grocery-200 px-4 py-2 text-grocery-900"
        >
          <PencilIcon /> Edit
        </button>
      </div>
    </div>
  );
}