import { WordCategory } from '../types/WordCategory';

type Props = {
  category: WordCategory;
};

export default function CategoryCard({ category }: Props) {
  return (
    <li className="border border-primary-1 rounded p-4 shadow-sm bg-white">
      <h2 className="text-lg font-medium text-text">{category.name}</h2>
      {category.description && (
        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
      )}
    </li>
  );
}
