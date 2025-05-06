import Button from '../../../shared/components/Button';
import { WordCategory } from '../types/WordCategory';
import { FiFolder } from 'react-icons/fi';
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

type Props = {
  category: WordCategory;
  onEdit: (category: WordCategory) => void;
  onDelete: (category: WordCategory) => void;
};

export default function CategoryCard({ category, onEdit, onDelete }: Props) {
  return (
    <div className="w-[300px] flex flex-col justify-between border border-primary-1 rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary-2">
          <FiFolder className="text-xl" />
          <h2 className="text-lg font-bold text-title">{category.name}</h2>
        </div>
  
        {category.description && (
          <p className="text-sm text-gray-600">{category.description}</p>
        )}
      </div>
  
      <div className="flex gap-2 pt-4">
        <Button
          variant="secondary"
          onClick={() => onEdit(category)}
          className="flex items-center gap-1 w-1/2 justify-center"
        >
          <FaRegEdit /> Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(category)}
          className="flex items-center gap-1 w-1/2 justify-center"
        >
          <FaRegTrashAlt /> Delete
        </Button>
      </div>
    </div>
  );
}
