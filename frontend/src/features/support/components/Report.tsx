import { Button } from '@/components/ui/Button';
import { TextAreaField } from '@/components/ui/TextArea';
import { TextField } from '@/components/ui/TextField';
import { useReportSupport } from '@/features/support';

export default function Report() {
  const { form, onSubmit, isSubmitting } = useReportSupport();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-black/20 bg-[#F7FCFF] p-4">
      <h2 className="text-2xl font-bold">Report a Problem</h2>
      <form className="flex flex-col gap-4 p-9" onSubmit={onSubmit}>
        <div className="space-y-1">
          <TextField label="Issue type" {...form.register('issue_type')} />
          {errors.issue_type?.message ? (
            <p className="text-xs text-red-600">{errors.issue_type.message}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <TextField label="Order number (optional)" id="order_number" {...register('order_number')} />
          {errors.order_number?.message ? (
            <p className="text-xs text-red-600">{errors.order_number.message}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <TextAreaField label="Message" rows={4} {...form.register('message')} />
          {errors.message?.message ? (
            <p className="text-xs text-red-600">{errors.message.message}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
