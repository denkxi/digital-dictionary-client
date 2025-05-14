import { useForm } from "react-hook-form";
import {
  useCreateWordMutation,
  useDeleteWordMutation,
  useUpdateWordMutation,
} from "../services/wordApi";
import { Word, NewWord, WordClass } from "../types/Word";
import { useGetAllWordCategoriesQuery } from "../../wordCategories/services/wordCategoryApi";
import InputField from "../../../shared/components/InputField";
import TextareaField from "../../../shared/components/TextareaField";
import SelectField from "../../../shared/components/SelectField";
import Button from "../../../shared/components/Button";
import { FiCheck, FiX, FiInfo } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import ConfirmDeleteModal from "../../../shared/components/ConfirmDeleteModal";

type Props = {
  dictionaryId: string;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: Word;
};

export default function WordModal({
  dictionaryId,
  onClose,
  mode,
  initialData,
}: Props) {
  const { data } = useGetAllWordCategoriesQuery();
  const categories = data?.items || [];

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const [createWord] = useCreateWordMutation();
  const [updateWord] = useUpdateWordMutation();
  const [deleteWord] = useDeleteWordMutation();

  const { register, handleSubmit, reset, watch } = useForm<NewWord>({
    defaultValues: {
      writing: initialData?.writing || "",
      translation: initialData?.translation || "",
      pronunciation: initialData?.pronunciation || "",
      definition: initialData?.definition || "",
      useExample: initialData?.useExample || "",
      wordClass: initialData?.wordClass,
      isStarred: initialData?.isStarred || false,
      isLearned: initialData?.isLearned || false,
      dictionaryId,
      categoryId: initialData?.categoryId,
    },
  });

  const onSubmit = async (data: NewWord) => {
    try {
      if (mode === "create") {
        await createWord(data).unwrap();
      } else if (mode === "edit" && initialData) {
        await updateWord({ id: initialData.id, data }).unwrap();
      }
      reset();
      onClose();
    } catch (err: any) {
      alert(err?.data?.error || "Failed to save word");
    }
  };

  const onDelete = () => {
    setOpenDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    console.log("Deleting word:", initialData?.id);
    if (!initialData?.id) return;
    try {
      await deleteWord(initialData.id).unwrap();
      setOpenDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error("Failed to delete word:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-text mb-4">
          {mode === "create" ? "Add New Word" : "Edit Word"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <FiInfo className="w-3 h-3" /> This is how the word is written in
            the language you're learning.
          </p>
          <InputField
            label="*Writing"
            register={register("writing", { required: true })}
            value={watch("writing")}
          />
          <InputField
            label="*Translation"
            register={register("translation", { required: true })}
            value={watch("translation")}
          />
          <InputField
            label="Pronunciation"
            register={register("pronunciation")}
            value={watch("pronunciation")}
          />

          <TextareaField
            label="Definition"
            register={register("definition")}
            value={watch("definition")}
            rows={2}
          />
          <TextareaField
            label="Use Example"
            register={register("useExample")}
            value={watch("useExample")}
            rows={2}
          />

          <SelectField label="Word Class" register={register("wordClass")}>
            <option value="">Select Word Class</option>
            {Object.entries(WordClass).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </SelectField>

          <SelectField label="Category" register={register("categoryId")}>
            <option value="">No Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>

          <div className="flex justify-between items-center pt-2">
            {mode === "edit" ? (
              <button
                type="button"
                onClick={() => onDelete()}
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition cursor-pointer"
                aria-label="Delete word"
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
          title="Delete Word"
          description={`Are you sure you want to delete "${initialData?.writing}" word?`}
          onCancel={() => setOpenDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
