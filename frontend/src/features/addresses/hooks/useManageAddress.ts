import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createAddressSchema } from "@/features/addresses/schema";
import type { CreateAddressValues } from "@/features/addresses/schema";
import { addressService, extractApiErrorMessage } from "@/features/addresses/service";

export type { Address } from "@/features/addresses/types";
export type { CreateAddressValues } from "@/features/addresses/schema";

const ADDRESSES_QUERY_KEY = ["addresses"] as const;

const EMPTY_FORM: CreateAddressValues = {
  full_name: "",
  city: "",
  phone: "",
  street_address: "",
  address: "",
};

export function useManageAddress() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const form = useForm<CreateAddressValues>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: EMPTY_FORM,
  });

  const { data: addresses = [], isPending: isLoading } = useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: addressService.getAll,
  });

  const invalidateAddresses = () =>
    queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });

  const createMutation = useMutation({
    mutationFn: addressService.create,
    onSuccess: async () => {
      await invalidateAddresses();
      form.reset(EMPTY_FORM);
      toast.success("Address created successfully");
      setOpen(false);
    },
    onError: (err) => toast.error(extractApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string | number; values: CreateAddressValues }) =>
      addressService.update(id, values),
    onSuccess: async () => {
      await invalidateAddresses();
      toast.success("Address updated successfully");
      form.reset(EMPTY_FORM);
      setEditingId(null);
      setOpen(false);
    },
    onError: (err) => toast.error(extractApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: addressService.delete,
    onSuccess: async () => {
      await invalidateAddresses();
      toast.success("Address deleted successfully");
      setDeletingId(null);
    },
    onError: (err) => toast.error(extractApiErrorMessage(err)),
  });

  const startCreate = () => {
    setEditingId(null);
    form.reset(EMPTY_FORM);
    setOpen(true);
  };

  const startEdit = (id: string | number | undefined) => {
    if (!id) return;
    setEditingId(id);

    const found = addresses.find((a) => a.id === id || a._id === id);
    form.reset(
      found
        ? {
            full_name: found.full_name ?? "",
            city: found.city ?? "",
            phone: found.phone ?? "",
            street_address: found.street_address ?? "",
            address: found.address ?? "",
          }
        : EMPTY_FORM
    );
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
    setEditingId(null);
    form.reset(EMPTY_FORM);
  };

  const openDelete = (id: string | number | undefined) => {
    if (!id) return;
    setDeletingId(id);
  };

  const cancelDelete = () => setDeletingId(null);

  const confirmDelete = () => {
    if (!deletingId) return;
    deleteMutation.mutate(deletingId);
  };

  const onSubmit = form.handleSubmit((values) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, values });
      return;
    }
    createMutation.mutate(values);
  });

  return {
    // list
    addresses,
    isLoading,

    // form dialog
    open,
    editingId,
    register: form.register,
    errors: form.formState.errors,
    saving: createMutation.isPending || updateMutation.isPending,
    onSubmit,
    startCreate,
    startEdit,
    closeForm,

    // delete dialog
    deletingId,
    openDelete,
    cancelDelete,
    confirmDelete,
  };
}
