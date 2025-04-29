import { useForm } from 'react-hook-form';
import { Dictionary, NewDictionary } from '../types/Dictionary';
import {
  useCreateDictionaryMutation,
  useUpdateDictionaryMutation,
} from '../services/dictionaryApi';

type Props = {
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: Dictionary;
};

export default function DictionaryModal({ onClose, mode, initialData }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewDictionary>({
    defaultValues: {
      name: initialData?.name || '',
      sourceLanguage: initialData?.sourceLanguage || '',
      targetLanguage: initialData?.targetLanguage || '',
      description: initialData?.description || '',
    },
  });

  const [createDictionary] = useCreateDictionaryMutation();
  const [updateDictionary] = useUpdateDictionaryMutation();

  const onSubmit = async (data: NewDictionary) => {
    try {
      if (mode === 'create') {
        await createDictionary(data).unwrap();
      } else if (mode === 'edit' && initialData) {
        await updateDictionary({ id: initialData.id, data }).unwrap();
      }
      reset();
      onClose();
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to save dictionary');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-text mb-4">
          {mode === 'create' ? 'New Dictionary' : 'Edit Dictionary'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('name', { required: true })}
            placeholder="Dictionary Name"
            className="input w-full"
          />
          <input
            {...register('sourceLanguage', { required: true })}
            placeholder="Source Language"
            className="input w-full"
          />
          <input
            {...register('targetLanguage', { required: true })}
            placeholder="Target Language"
            className="input w-full"
          />
          <textarea
            {...register('description')}
            placeholder="Optional Description"
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
