import { useParams } from 'react-router-dom';
import { useState } from 'react';
import NewWordModal from './components/NewWordModal';
import WordItem from './components/WordItem';
import BackButton from '../../shared/components/BackButton';

export default function WordList() {
  const { dictionaryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Temporary placeholder data
  const words = [
    { id: 1, writing: '猫', translation: 'cat' },
    { id: 2, writing: '犬', translation: 'dog' }
  ];

  return (
    <div>
      <BackButton />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">Words</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-2 hover:bg-primary-1 px-4 py-2 rounded text-sm font-medium"
        >
          + New Word
        </button>
      </div>

      <div className="space-y-3">
        {words.map(word => (
          <WordItem key={word.id} word={word} />
        ))}
      </div>

      {isModalOpen && (
        <NewWordModal dictionaryId={Number(dictionaryId)} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
