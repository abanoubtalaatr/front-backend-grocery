import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { languageService } from "../service";
import { languageSchema, type Language } from "../schema";

export default function useLanguageManagement() {
  const form = useForm<Language>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: "en",
    },
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["language"],
    queryFn: languageService.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (values: Language) => languageService.update(values),
    onSuccess: () => {
      toast.success("Language updated successfully");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Could not update language",
      );
    },
  });


  const defaultLanguage: Language = { language: "en" };

  return {
    language: data ?? defaultLanguage,
    isPending,
    isError,
    error,
    form,
    updateMutation,
  };
}
