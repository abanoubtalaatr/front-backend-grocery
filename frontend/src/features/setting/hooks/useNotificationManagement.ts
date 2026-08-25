import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notificationsSchema, type Notifications } from '../schema';
import { notificationSettingService } from '../service';
import { toast } from 'sonner';

export default function useNotificationManagement() {
  const form = useForm<Notifications>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      order_updates: true,
      promotion_emails: true,
      nutrition_insights: true,
      price_alerts: true,
    },
  });
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationSettingService.getNotifications,
  });
  const updateMutation = useMutation({
    mutationFn: (values: Notifications) => notificationSettingService.update(values),
    onSuccess: () => {
      toast.success('Notifications updated successfully');
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Could not update notifications');
    },
  });
  return {
    notification: data,
    isPending,
    isError,
    error,
    form,
    updateMutation,
  };
}
