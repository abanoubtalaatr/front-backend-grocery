import { FavoriteIcon } from "@/components/ui/FormIcons";

export function FavoriteHeader() {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t  pt-5 border-b border-grocery-200 pb-5">
        <div className="flex items-center gap-2">
          <FavoriteIcon className="size-6" />
          <span className="text-lg font-medium text-grocery-900">
            Favorites items
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/favorites">Manage favorites</a>
        </div>
      </div>
  );
}