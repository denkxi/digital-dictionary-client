import { useState } from 'react';
import { useCreateWordCategoryMutation } from '../services/wordCategoryApi';

type Props = {
  onClose: () => void;
};

export default function NewCategoryModal({ onClose }: Props) {
  const [form, setForm] = useState({ name: '', description: '' });
  const [createCategory] = useCreateWordCategoryMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategory(form).unwrap();
      onClose();
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to create category');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-text mb-4">New Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Category Name"
            onChange={handleChange}
            value={form.name}
            className="input w-full"
            required
          />
          <textarea
            name="description"
            placeholder="Optional Description"
            rows={3}
            onChange={handleChange}
            value={form.description}
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
              type="submit"
              className="px-4 py-2 text-sm bg-primary-2 hover:bg-primary-1 rounded font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
