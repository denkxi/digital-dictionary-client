import { useState } from "react";
import { NewDictionary } from "../types/Dictionary";
import { useCreateDictionaryMutation } from "../services/dictionaryApi";

type Props = {
  onClose: () => void;
};

export default function NewDictionaryModal({ onClose }: Props) {
  const [form, setForm] = useState<NewDictionary>({
    name: '',
    sourceLanguage: '',
    targetLanguage: '',
    description: '',
  });

  const [createDictionary] = useCreateDictionaryMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createDictionary(form).unwrap();
      onClose();
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to create dictionary');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-text mb-4">New Dictionary</h2>

        <input
          name="name"
          placeholder="Dictionary Name"
          value={form.name}
          onChange={handleChange}
          className="input w-full"
        />

        <input
          name="sourceLanguage"
          placeholder="Source Language (e.g. Japanese)"
          value={form.sourceLanguage}
          onChange={handleChange}
          className="input w-full"
        />

        <input
          name="targetLanguage"
          placeholder="Target Language (e.g. English)"
          value={form.targetLanguage}
          onChange={handleChange}
          className="input w-full"
        />

        <textarea
          name="description"
          placeholder="Optional Description"
          value={form.description}
          onChange={handleChange}
          className="input w-full resize-none"
        />

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
