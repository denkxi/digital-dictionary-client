import { useForm } from 'react-hook-form';
import { useCreateWordMutation, useUpdateWordMutation } from '../services/wordApi';
import { Word, NewWord, WordClass } from '../types/Word';
import { useGetAllWordCategoriesQuery } from '../../wordCategories/services/wordCategoryApi';
import InputField from '../../../shared/components/InputField';
import TextareaField from '../../../shared/components/TextareaField';
import SelectField from '../../../shared/components/SelectField';
import Button from '../../../shared/components/Button';
import { FiCheck, FiX } from 'react-icons/fi';

type Props = {
  dictionaryId: string;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialData?: Word;
};

export default function WordModal({ dictionaryId, onClose, mode, initialData }: Props) {
  const { data } = useGetAllWordCategoriesQuery();
  const categories = data?.items || [];
  const [createWord] = useCreateWordMutation();
  const [updateWord] = useUpdateWordMutation();

  const { register, handleSubmit, reset, watch } = useForm<NewWord>({
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

  const onSubmit = async (formData: NewWord) => {
    const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '')
    ) as NewWord;

    try {
      if (mode === 'create') {
        await createWord(payload).unwrap();
      } else if (mode === 'edit' && initialData) {
        await updateWord({ id: initialData._id, data: payload }).unwrap();
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
          <InputField label="Writing" register={register('writing', { required: true })} value={watch('writing')} />
          <InputField label="Translation" register={register('translation', { required: true })} value={watch('translation')} />
          <InputField label="Pronunciation" register={register('pronunciation')} value={watch('pronunciation')} />

          <TextareaField label="Definition" register={register('definition')} value={watch('definition')} rows={2} />
          <TextareaField label="Use Example" register={register('useExample')} value={watch('useExample')} rows={2} />

          <SelectField label="Word Class" register={register('wordClass')}>
            <option value="">Select Word Class</option>
            {Object.entries(WordClass).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </SelectField>

          <SelectField label="Category" register={register('categoryId')}>
            <option value="">No Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </SelectField>

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

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex items-center gap-2">
              <FiX /> Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex items-center gap-2">
              <FiCheck /> {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
