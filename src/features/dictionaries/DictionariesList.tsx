import { useState } from 'react';
import NewDictionaryModal from './components/NewDictionaryModal';
import DictionaryCard from './components/DictionaryCard';
import { useGetUserDictionariesQuery } from './services/dictionaryApi';

export default function DictionariesList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: dictionaries = [], isLoading, isError } = useGetUserDictionariesQuery();

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

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Failed to load dictionaries.</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dictionaries.map(dict => (
          <DictionaryCard key={dict.id} dictionary={dict} />
        ))}
      </div>

      {isModalOpen && <NewDictionaryModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
