import { useForm } from 'react-hook-form';
import { useCreateWordMutation, useUpdateWordMutation } from '../services/wordApi';
import { Word, NewWord, WordClass } from '../types/Word';
import { useGetWordCategoriesQuery } from '../../wordCategories/services/wordCategoryApi';

type Props = {
  dictionaryId: string;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: Word;
};

export default function WordModal({ dictionaryId, onClose, mode, initialData }: Props) {
  const { data: categories = [] } = useGetWordCategoriesQuery();
  const [createWord] = useCreateWordMutation();
  const [updateWord] = useUpdateWordMutation();

  const { register, handleSubmit, reset } = useForm<NewWord>({
    defaultValues: {
      writing: initialData?.writing || '',
      translation: initialData?.translation || '',
      pronunciation: initialData?.pronunciation || '',
      definition: initialData?.definition || '',
      useExample: initialData?.useExample || '',
      wordClass: initialData?.wordClass,
      isStarred: initialData?.isStarred || false,
      isLearned: initialData?.isLearned || false,
      dictionaryId,
      categoryId: initialData?.categoryId,
    },
  });

  const onSubmit = async (data: NewWord) => {
    try {
      if (mode === 'create') {
        await createWord(data).unwrap();
      } else if (mode === 'edit' && initialData) {
        await updateWord({ id: initialData.id, data }).unwrap();
      }
      reset();
      onClose();
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to save word');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-text mb-4">
          {mode === 'create' ? 'Add New Word' : 'Edit Word'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('writing', { required: true })} placeholder="Writing" className="input w-full" />
          <input {...register('translation', { required: true })} placeholder="Translation" className="input w-full" />
          <input {...register('pronunciation')} placeholder="Pronunciation" className="input w-full" />
          <textarea {...register('definition')} placeholder="Definition" className="input w-full resize-none" />
          <textarea {...register('useExample')} placeholder="Use Example" className="input w-full resize-none" />

          <select {...register('wordClass')} className="input w-full">
            <option value="">Select Word Class</option>
            {Object.entries(WordClass).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </select>

          <select {...register('categoryId')} className="input w-full">
            <option value="">No Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isStarred')} />
              Starred
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isLearned')} />
              Learned
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-accent-2 hover:bg-green-100 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-primary-2 hover:bg-primary-1 rounded font-medium">
              {mode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
