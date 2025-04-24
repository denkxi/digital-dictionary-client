import { useForm, FormProvider } from 'react-hook-form';
import { useCreateQuizMutation } from '../services/quizApi';
import { useGetUserDictionariesQuery } from '../../dictionaries/services/dictionaryApi';
import { QuestionType } from '../types/quizTypes';
import { useNavigate } from 'react-router-dom';

type FormValues = {
  dictionaryId: number;
  questionType: QuestionType;
  wordCount: number;
};

type Props = {
  onClose: () => void;
};

export default function NewQuizModal({ onClose }: Props) {
  const methods = useForm<FormValues>({
    defaultValues: {
      dictionaryId: 0,
      questionType: QuestionType.Mixed,
      wordCount: 5
    }
  });

  const { data: dictionaries = [] } = useGetUserDictionariesQuery();
  const [createQuiz] = useCreateQuizMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await createQuiz(data).unwrap();
      onClose();
      navigate(`/quizzes/${res.quiz.id}`);
    } catch (err: any) {
      alert(err?.data?.error || 'Failed to create quiz');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg p-6 shadow-md w-full max-w-md space-y-4"
        >
          <h2 className="text-xl font-semibold text-text">Create a Quiz</h2>

          <select {...register('dictionaryId', { required: true })} className="input w-full">
            <option value={0} disabled>Select dictionary</option>
            {dictionaries.map(dictionary => (
              <option key={dictionary.id} value={dictionary.id}>
                {dictionary.name} ({dictionary.sourceLanguage} → {dictionary.targetLanguage})
              </option>
            ))}
          </select>

          <select {...register('questionType')} className="input w-full">
            {Object.values(QuestionType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <input
            type="number"
            {...register('wordCount', { required: true, min: 2 })}
            className="input w-full"
            placeholder="Word Count"
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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-primary-2 hover:bg-primary-1 rounded font-medium"
            >
              Start
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
