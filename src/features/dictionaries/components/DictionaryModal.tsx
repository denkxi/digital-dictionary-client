import { useForm } from "react-hook-form";
import { Dictionary, NewDictionary } from "../types/Dictionary";
import {
  useCreateDictionaryMutation,
  useDeleteDictionaryMutation,
  useUpdateDictionaryMutation,
} from "../services/dictionaryApi";
import Button from "../../../shared/components/Button";
import { FiCheck, FiX } from "react-icons/fi";
import InputField from "../../../shared/components/InputField";
import TextareaField from "../../../shared/components/TextareaField";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import ConfirmDeleteModal from "../../../shared/components/ConfirmDeleteModal";

type Props = {
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: Dictionary;
};

export default function DictionaryModal({ onClose, mode, initialData }: Props) {
  const { register, handleSubmit, reset, watch } = useForm<NewDictionary>({
    defaultValues: {
      name: initialData?.name || "",
      sourceLanguage: initialData?.sourceLanguage || "",
      targetLanguage: initialData?.targetLanguage || "",
      description: initialData?.description || "",
    },
  });

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const [createDictionary] = useCreateDictionaryMutation();
  const [updateDictionary] = useUpdateDictionaryMutation();
  const [deleteDictionary] = useDeleteDictionaryMutation();

  const onSubmit = async (data: NewDictionary) => {
    try {
      if (mode === "create") {
        await createDictionary(data).unwrap();
      } else if (mode === "edit" && initialData) {
        await updateDictionary({ id: initialData.id, data }).unwrap();
      }
      reset();
      onClose();
    } catch (err: any) {
      alert(err?.data?.error || "Failed to save dictionary");
    }
  };

  const onDelete = () => {
    setOpenDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    console.log("Deleting dictionary:", initialData?.id);
    if (!initialData?.id) return;
    try {
      await deleteDictionary(initialData.id).unwrap();
      setOpenDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error("Failed to delete dictionary:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-text mb-4">
          {mode === "create" ? "New Dictionary" : "Edit Dictionary"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="*Dictionary Name"
            register={register("name", { required: true })}
            value={watch("name")}
          />
          <InputField
            label="*Source Language"
            register={register("sourceLanguage", { required: true })}
            value={watch("sourceLanguage")}
          />
          <InputField
            label="*Target Language"
            register={register("targetLanguage", { required: true })}
            value={watch("targetLanguage")}
          />
          <TextareaField
            label="Description"
            register={register("description")}
            value={watch("description")}
            rows={3}
          />

          <div className="flex justify-between items-center pt-2">
            {mode === "edit" ? (
              <button
                type="button"
                onClick={() => onDelete()}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition cursor-pointer"
                aria-label="Delete dictionary"
              >
                <FaRegTrashAlt className="text-lg" />
              </button>
            ) : (
              <div />
            )}

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
          title="Delete Dictionary"
          description={`Are you sure you want to delete "${initialData?.name}" dictionary?`}
          onCancel={() => setOpenDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
