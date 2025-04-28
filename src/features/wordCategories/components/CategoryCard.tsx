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
        <button
          onClick={() => onEdit(category)}
          className="px-3 py-1 text-sm bg-primary-2 hover:bg-primary-1 rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(category)}
          className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-400 rounded transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
