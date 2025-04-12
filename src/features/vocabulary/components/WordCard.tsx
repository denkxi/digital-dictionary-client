import { useState } from 'react';
import { Word } from '../types/vocabulary';
import { useUpdateWordMutation, useDeleteWordMutation } from '../services/vocabularyApi';

interface WordCardProps {
  word: Word;
}

const WordCard = ({ word }: WordCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const [updateWord, { isLoading: isUpdating }] = useUpdateWordMutation();
  const [deleteWord, { isLoading: isDeleting }] = useDeleteWordMutation();
  
  // TODO: Implement authorization
  const userId = 'user-1';

  const handleMarkLearned = async () => {
    try {
      await updateWord({ 
        userId, 
        id: word.id, 
        learned: true 
      });
    } catch (error) {
      console.error('Failed to mark word as learned:', error);
    }
  };

  const handleRemove = async () => {
    if (confirm('Are you sure you want to remove this word?')) {
      try {
        await deleteWord({ userId, id: word.id });
      } catch (error) {
        console.error('Failed to delete word:', error);
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${expanded ? 'mb-4' : 'mb-2'}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-800">{word.word}</h3>
              {word.learned && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Learned
                </span>
              )}
            </div>
            <p className="text-gray-600">{word.translation}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-500 hover:text-blue-700"
            >
              {expanded ? '▲' : '▼'}
            </button>
            <button 
              onClick={handleMarkLearned} 
              disabled={word.learned || isUpdating}
              className={`${
                word.learned || isUpdating
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-green-500 hover:text-green-700'
              }`}
            >
              ✓
            </button>
            <button 
              onClick={handleRemove} 
              disabled={isDeleting}
              className={`${
                isDeleting
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-red-500 hover:text-red-700'
              }`}
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0">
          {word.examples && word.examples.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Examples:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {word.examples.map((example, idx) => (
                  <li key={idx}>{example}</li>
                ))}
              </ul>
            </div>
          )}
          
          {word.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
              <p className="text-sm text-gray-600">{word.notes}</p>
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-500">
            Added: {new Date(word.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordCard;