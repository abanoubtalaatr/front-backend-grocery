import { SelectField } from "@/components/ui/SelectField";
import { Language as languageOptions } from "../types";
import { useLanguageManagement } from "@/features/setting";
import type { Language as LanguageSettings } from "../schema";
import { Button } from "@/components/ui/Button";
export default function Language() {
  const languageManagementHook = useLanguageManagement();
  return (
    <div className="bg-[#F7FCFF]">
      <form onSubmit={languageManagementHook.form.handleSubmit((values) => languageManagementHook.updateMutation.mutate(values))}>
        <SelectField
        onChange={(e) =>
          languageManagementHook.form.setValue("language", e.target.value as LanguageSettings["language"])
        }
        value={languageManagementHook.language.language}
        error={languageManagementHook.form.formState.errors.language?.message}
        required
          label="Language"
          options={Object.entries(languageOptions).map(([value, label]) => ({
            label,
            value,
          }))}
        />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
