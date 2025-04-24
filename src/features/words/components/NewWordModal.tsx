import { useState } from "react";
import { NewWord } from "../types/Word";
import { useCreateWordMutation } from "../services/wordApi";
import { WordClass } from "../types/Word";
import { useGetWordCategoriesQuery } from "../../wordCategories/services/wordCategoryApi";

type Props = {
  dictionaryId: string;
  onClose: () => void;
};

const defaultForm: NewWord = {
  writing: "",
  translation: "",
  pronunciation: "",
  definition: "",
  useExample: "",
  wordClass: undefined,
  isStarred: false,
  isLearned: false,
  dictionaryId: '',
  categoryId: undefined,
};

export default function NewWordModal({ dictionaryId, onClose }: Props) {
  const [form, setForm] = useState({ ...defaultForm, dictionaryId });
  const { data: categories = [] } = useGetWordCategoriesQuery();
  const [createWord] = useCreateWordMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, value } = target;

    const parsedValue =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createWord(form).unwrap();
      onClose();
    } catch (err: any) {
      alert(err?.data?.error || "Failed to create word");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-text mb-4">Add New Word</h2>

        <input
          name="writing"
          placeholder="Writing"
          value={form.writing}
          onChange={handleChange}
          className="input w-full"
        />

        <input
          name="translation"
          placeholder="Translation"
          value={form.translation}
          onChange={handleChange}
          className="input w-full"
        />

        <input
          name="pronunciation"
          placeholder="Pronunciation (optional)"
          value={form.pronunciation}
          onChange={handleChange}
          className="input w-full"
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.definition}
          onChange={handleChange}
          className="input w-full resize-none"
        />

        <textarea
          name="useExample"
          placeholder="Example of use (optional)"
          value={form.useExample}
          onChange={handleChange}
          className="input w-full resize-none"
        />

        <select
          name="wordClass"
          value={form.wordClass || ""}
          onChange={handleChange}
          className="input w-full"
        >
          <option value="">Select Word Class</option>
          {Object.entries(WordClass).map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>

        <select
          name="categoryId"
          value={form.categoryId ?? ""}
          onChange={handleChange}
          className="input w-full"
        >
          <option value="">No Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isStarred"
              checked={form.isStarred}
              onChange={handleChange}
            />
            Starred
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isLearned"
              checked={form.isLearned}
              onChange={handleChange}
            />
            Learned
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm bg-accent-2 hover:bg-green-100 rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-primary-2 hover:bg-primary-1 rounded font-medium"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
