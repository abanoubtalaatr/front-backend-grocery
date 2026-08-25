import type { FormEvent, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

type FormModalProps = {
  open: boolean
  title: string
  submitLabel?: string
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  children: ReactNode
  className?: string
}

export function FormModal({
  open,
  title,
  submitLabel = 'Save',
  loading,
  onOpenChange,
  onSubmit,
  children,
  className,
}: FormModalProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className ?? 'max-w-2xl'}>
        <DialogTitle className="text-grocery-900 pr-10 text-lg font-semibold">{title}</DialogTitle>

        <form onSubmit={handleSubmit} className="mt-4">
          {/* Long forms scroll inside the modal rather than pushing it off-screen. */}
          <div className="max-h-[65vh] overflow-y-auto pr-1">{children}</div>

          <div className="border-line mt-4 flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-auto" loading={loading}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
