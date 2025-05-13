import Button from "../../../shared/components/Button";
import { WordCategory } from "../types/WordCategory";
import { FiFolder } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";

type Props = {
  category: WordCategory;
  onEdit: (category: WordCategory) => void;
};

export default function CategoryCard({ category, onEdit }: Props) {
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

      <div className="flex justify-end pt-4">
        <Button
          variant="secondary"
          onClick={() => onEdit(category)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          aria-label="Edit category"
        >
          <FaRegEdit className="text-lg" />
        </Button>
      </div>
    </div>
  );
}
