import { useState } from 'react';
import NewDictionaryModal from './components/NewDictionaryModal';
import DictionaryCard from './components/DictionaryCard';

export default function DictionariesList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dictionaries = [
    {
      id: 1,
      sourceLanguage: 'English',
      targetLanguage: 'Japanese',
      description: 'JLPT N5 Vocab',
      createdAt: '2024-04-01',
      createdBy: 1
    },
    {
      id: 2,
      sourceLanguage: 'English',
      targetLanguage: 'Spanish',
      description: 'Business terms',
      createdAt: '2024-04-05',
      createdBy: 1
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">Dictionaries</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-2 hover:bg-primary-1 px-4 py-2 rounded text-sm font-medium"
        >
          + New Dictionary
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dictionaries.map(dict => (
          <DictionaryCard key={dict.id} dictionary={dict} />
        ))}
      </div>

      {isModalOpen && <NewDictionaryModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
