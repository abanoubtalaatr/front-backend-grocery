import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appearanceSchema, type Appearance } from '../schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { appearanceService } from '../service';
import { toast } from 'sonner';

export default function useAppearanceManagement() {
  const form = useForm<Appearance>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      theme: 'light',
    },
  });
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['appearance'],
    queryFn: appearanceService.getAppearance,
  });
  const updateMutation = useMutation({
    mutationFn: (values: Appearance) => appearanceService.update(values),
    onSuccess: () => {
      toast.success('Appearance updated successfully');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Could not update appearance');
    },
  });
  return {
    appearance: data,
    isPending,
    isError,
    error,
    form,
    updateMutation,
  };
}
