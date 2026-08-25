import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createSupportSchema, type CreateSupportValues } from '../schema';
import { extractApiErrorMessage, supportService } from '../services';

const EMPTY_FORM: CreateSupportValues = {
  issue_type: '',
  order_number: '',
  message: '',
};

export function useReportSupport() {
  const form = useForm<CreateSupportValues>({
    resolver: zodResolver(createSupportSchema),
    defaultValues: EMPTY_FORM,
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateSupportValues) => supportService.submitReport(values),
    onSuccess: () => {
      form.reset(EMPTY_FORM);
      toast.success('Support report submitted successfully');
    },
    onError: (error) => {
      toast.error(extractApiErrorMessage(error));
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    createMutation.mutate(values);
  });

  return {
    form,
    onSubmit,
    isSubmitting: createMutation.isPending,
  };
}
