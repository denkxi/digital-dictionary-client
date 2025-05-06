import { useForm } from "react-hook-form";
import {
  useCreateWordCategoryMutation,
  useUpdateWordCategoryMutation,
} from "../services/wordCategoryApi";
import InputField from "../../../shared/components/InputField";
import TextareaField from "../../../shared/components/TextareaField";
import Button from "../../../shared/components/Button";
import { FiCheck, FiX } from "react-icons/fi";

type Props = {
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: { id: string; name: string; description?: string };
};

export default function CategoryModal({ onClose, mode, initialData }: Props) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const [createCategory] = useCreateWordCategoryMutation();
  const [updateCategory] = useUpdateWordCategoryMutation();

  const onSubmit = async (data: { name: string; description?: string }) => {
    try {
      if (mode === "create") {
        await createCategory(data).unwrap();
      } else if (mode === "edit" && initialData) {
        await updateCategory({ id: initialData.id, data }).unwrap();
      }
      reset();
      onClose();
    } catch (err: any) {
      alert(err?.data?.error || "Failed to save category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-text mb-4">
          {mode === "create" ? "New Category" : "Edit Category"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Category Name"
            register={register("name", { required: true })}
            value={watch("name")}
          />
          <TextareaField
            label="Description (optional)"
            register={register("description")}
            value={watch("description")}
            rows={3}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex items-center gap-2">
              <FiX /> Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex items-center gap-2">
              <FiCheck /> {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
