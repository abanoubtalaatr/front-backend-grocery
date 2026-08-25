import { Button } from "./Button";

export function AddingButton({ onClick, label }: { onClick: () => void, label: string }) {
    return (
        <div className="flex items-center justify-between gap-3">
        <Button className="w-auto" onClick={onClick}>
          + Add {label}
        </Button>
      </div>

    )
}   