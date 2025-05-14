import { useForm } from "react-hook-form";
import {
  useCreateWordCategoryMutation,
  useDeleteWordCategoryMutation,
  useUpdateWordCategoryMutation,
} from "../services/wordCategoryApi";
import InputField from "../../../shared/components/InputField";
import TextareaField from "../../../shared/components/TextareaField";
import Button from "../../../shared/components/Button";
import { FiCheck, FiX } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import ConfirmDeleteModal from "../../../shared/components/ConfirmDeleteModal";
import { useState } from "react";

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

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const [createCategory] = useCreateWordCategoryMutation();
  const [updateCategory] = useUpdateWordCategoryMutation();
  const [deleteCategory] = useDeleteWordCategoryMutation();

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

  const onDelete = () => {
    setOpenDeleteConfirm(true);
  }

  const handleConfirmDelete = async () => {
    console.log("Deleting category:", initialData?.id);
    if (!initialData?.id) return;
    try {
      await deleteCategory(initialData.id).unwrap();
      setOpenDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error("Failed to delete category:", err);
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
          <div className="flex justify-between items-center pt-2">
            {mode === "edit" ? (
              <button
              type="button"
              onClick={onDelete}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition cursor-pointer"
              aria-label="Delete category"
            >
              <FaRegTrashAlt className="text-lg" />
            </button>
            ) : <div />}

            <div className="flex gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <FiX /> Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="flex items-center gap-2"
              >
                <FiCheck /> {mode === "create" ? "Create" : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {openDeleteConfirm && (
        <ConfirmDeleteModal
          title="Delete Category"
          description={`Are you sure you want to delete "${initialData?.name}"?`}
          onCancel={() => setOpenDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
