import { useState } from 'react';
import WordCategoryModal from './WordCategoryModal';

export default function WordCategoryList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Placeholder data
  const wordCategories = [
    { id: 1, name: 'Travel', description: 'Words related to travel' },
    { id: 2, name: 'Business', description: 'Corporate and finance vocab' },
    { id: 3, name: 'Animals', description: '' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">Word Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-2 hover:bg-primary-1 px-4 py-2 rounded text-sm font-medium"
        >
          + New Category
        </button>
      </div>

      <ul className="space-y-4">
        {wordCategories.map(cat => (
          <li
            key={cat.id}
            className="border border-primary-1 rounded p-4 shadow-sm bg-white"
          >
            <h2 className="text-lg font-medium text-text">{cat.name}</h2>
            {cat.description && (
              <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
            )}
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <WordCategoryModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
