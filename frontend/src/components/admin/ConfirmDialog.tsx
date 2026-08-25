import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/Button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

/** Destructive actions always route through here — nothing deletes on one click. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  loading,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-grocery-900 text-lg font-semibold">{title}</DialogTitle>
        <DialogDescription className="text-grocery-500 mt-2 text-sm">
          {description}
        </DialogDescription>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" className="w-auto" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-danger-500 hover:bg-danger-700 w-auto"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
