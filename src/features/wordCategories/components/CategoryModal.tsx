import { useForm } from 'react-hook-form';
import { useCreateWordCategoryMutation, useUpdateWordCategoryMutation } from '../services/wordCategoryApi';

type Props = {
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: { id: string; name: string; description?: string };
};

export default function CategoryModal({ onClose, mode, initialData }: Props) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
    },
  });

  const [createCategory] = useCreateWordCategoryMutation();
  const [updateCategory] = useUpdateWordCategoryMutation();

  const onSubmit = async (data: { name: string; description?: string }) => {
    try {
      if (mode === 'create') {
        await createCategory(data).unwrap();
      } else if (mode === 'edit' && initialData) {
        await updateCategory({ id: initialData.id, ...data }).unwrap();
      }
      reset();
      onClose();
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to save category');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-text mb-4">
          {mode === 'create' ? 'New Category' : 'Edit Category'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('name', { required: true })}
            placeholder="Category Name"
            className="input w-full"
          />
          <textarea
            {...register('description')}
            placeholder="Optional Description"
            rows={3}
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
              {mode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
