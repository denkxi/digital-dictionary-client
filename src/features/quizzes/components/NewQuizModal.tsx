import { useForm, FormProvider } from 'react-hook-form';
import { useCreateQuizMutation } from '../services/quizApi';
import { useGetUserDictionariesQuery } from '../../dictionaries/services/dictionaryApi';
import { QuestionType } from '../types/quizTypes';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaTimes } from "react-icons/fa";
import Button from '../../../shared/components/Button';
import SelectField from '../../../shared/components/SelectField';
import InputField from '../../../shared/components/InputField';

type FormValues = {
  dictionaryId: string;
  questionType: QuestionType;
  wordCount: number;
};

type Props = {
  onClose: () => void;
};

export default function NewQuizModal({ onClose }: Props) {
  const methods = useForm<FormValues>({
    defaultValues: {
      dictionaryId: '',
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
      navigate(`/quizzes/${res.quiz._id}`);
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

          <SelectField label="Dictionary" register={register('dictionaryId', { required: true })}>
            <option value="">Select dictionary</option>
            {dictionaries.map(dictionary => (
              <option key={dictionary._id} value={dictionary._id}>{dictionary.name}</option>
            ))}
          </SelectField>

          <SelectField label="Question type" register={register('questionType')}>
            <option value="">Select question type</option>
            {Object.entries(QuestionType).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </SelectField>

          <InputField
            label="Word Count"
            type="number"
            register={register('wordCount', { required: true, min: 2 })}
            value={watch('wordCount').toString()}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex items-center gap-2">
              <FaTimes /> Cancel
            </Button>
            <Button variant="primary" type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
              <FaPlay /> Start
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
