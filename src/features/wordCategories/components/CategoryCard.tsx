import Button from '../../../shared/components/Button';
import { WordCategory } from '../types/WordCategory';

type Props = {
  category: WordCategory;
  onEdit: (category: WordCategory) => void;
  onDelete: (category: WordCategory) => void;
};

export default function CategoryCard({ category, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-primary-1 rounded-xl p-4 shadow hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-semibold text-text">{category.name}</h2>
        {category.description && (
          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <Button variant="secondary" onClick={() => onEdit(category)}>Edit</Button>
        <Button variant="danger" onClick={() => onDelete(category)}>Delete</Button>
      </div>
    </div>
  );
}
