import { useMemo, useState } from "react";

import { smartListSchema, type SmartListValues } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { smartListService } from "../services";
import { toast } from "sonner";
import { extractApiErrorMessage } from "@/features/addresses/service";

export function useSmartListManagement() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | undefined>(
    undefined,
  );
  const [deletingId, setDeletingId] = useState<string | number | undefined>(
    undefined,
  );
  const [openDelete, setOpenDelete] = useState(false);
  const queryClient = useQueryClient();
  const { data: products = [], isPending: isLoadingProducts } = useQuery({
    queryKey: ["products"] as const,
    queryFn: smartListService.getAllProducts,
  });

  const { data: smartLists = [], isPending: isLoadingSmartLists } = useQuery({
    queryKey: ["smart-lists"] as const,
    queryFn: smartListService.getSmartLists,
  });

  const form = useForm<SmartListValues>({
    resolver: zodResolver(smartListSchema),
    defaultValues: {
      name: "",
      image: undefined,
      items: [],
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SmartListValues }) =>
      smartListService.update(id, data),
    onSuccess: () => {
      toast.success("Smart list updated successfully");
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["smart-lists"] as const });
    },
    onError: (err) => toast.error(extractApiErrorMessage(err)),
  });
  const createMutation = useMutation({
    mutationFn: smartListService.create,
    onSuccess: () => {
      toast.success("Smart list created successfully");
      form.reset();
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["smart-lists"] as const });
    },
    onError: (err) => toast.error(extractApiErrorMessage(err)),
  });
  const onSubmit = form.handleSubmit(async (data) => {
    // Create still requires a file; edit can keep the server image (no new `File`).
    if (editingId === undefined && !(data.image instanceof File)) {
      toast.error("Image is required");
      return;
    }

    if (editingId !== undefined) {
      try {
        await updateMutation.mutateAsync({
          id: String(editingId),
          data,
        });
      } catch {
        // `onError` on the mutation already toasts; avoid unhandled rejection
      }
      return;
    }
    // `mutate()` returns void — RHF `isSubmitting` ends immediately. Use `mutateAsync`
    // so the submit handler stays async until the request finishes ("Adding..." shows).
    try {
      await createMutation.mutateAsync(data);
    } catch {
      // `onError` on the mutation already toasts; avoid unhandled rejection
    }
  });

  const existingImageUrl = useMemo(() => {
    if (editingId === undefined) return null;
    const list = Array.isArray(smartLists)
      ? smartLists.find((s) => String(s.id) === String(editingId))
      : undefined;
    const url = list?.image_url;
    return typeof url === "string" && url.length > 0 ? url : null;
  }, [editingId, smartLists]);

  const startCreate = () => {
    setEditingId(undefined);
    form.reset({ name: "", image: undefined, items: [] });
    setOpen(true);
  };

  const handleDialogOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setEditingId(undefined);
      form.reset({ name: "", image: undefined, items: [] });
    }
  };
  const deleteMutation = useMutation({
    mutationFn: smartListService.delete,
    onSuccess: () => {
      toast.success("Smart list deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["smart-lists"] as const });
    },
    onError: (err) => toast.error(extractApiErrorMessage(err)),
  });

  const openEdit = (id: string) => {
    setEditingId(id);
    setOpen(true);
    const smartList = Array.isArray(smartLists)
      ? smartLists.find((s) => String(s.id) === String(id))
      : undefined;
    if (smartList) {
      form.reset({
        name: smartList.name,
        // No fake `File` — `ImageUpload` previews remote images via `existingImageUrl`.
        image: undefined,
        items: (smartList.items ?? []).map((item) => item.id),
      });
    }
  };

  const onCancel = () => {
    setOpenDelete(false);
    setDeletingId(undefined);
  };

  const openDeleteDialog = (id: string | null) => {
    setDeletingId(id ?? undefined);
    setOpenDelete(true);
  };
  const onDelete = (id: string) => {
    deleteMutation.mutate(id);
    setOpenDelete(false);
    setDeletingId(undefined);
    queryClient.invalidateQueries({ queryKey: ["smart-lists"] as const });
    toast.success("Smart list deleted successfully");
  };
  return {
    open,
    setOpen,
    handleDialogOpenChange,
    startCreate,
    form,
    onSubmit,
    products,
    productsLoading: isLoadingProducts,
    smartLists,
    isLoading: isLoadingSmartLists,
    openEdit,
    editingId,
    existingImageUrl,
    onDelete,
    openDelete,
    openDeleteDialog,
    deletingId,
    onCancel,
  };
}
