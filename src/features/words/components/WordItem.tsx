import { Word } from "../types/Word";

type Props = {
  word: Word;
  onEdit: (word: Word) => void;
  onDelete: (word: Word) => void;
};

export default function WordItem({ word, onEdit, onDelete }: Props) {
  return (
    <div className="relative border border-primary-1 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="text-xl font-semibold text-text">{word.writing}</div>
      <div className="text-sm text-gray-600 mb-1">Translation: {word.translation}</div>
      {word.pronunciation && <div className="text-sm text-gray-500 italic">Pronunciation: {word.pronunciation}</div>}
      {word.definition && <div className="text-sm text-gray-700">Definition: {word.definition}</div>}
      {word.useExample && (
        <div className="text-sm text-gray-700 italic mt-1">Example: "{word.useExample}"</div>
      )}
      {word.wordClass && <div className="text-xs text-gray-500 mt-1">Class: {word.wordClass}</div>}
      {word.isStarred && <div className="text-xs text-yellow-600 font-medium">⭐ Starred</div>}
      {word.isLearned && <div className="text-xs text-green-600 font-medium">✓ Learned</div>}

      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => onEdit(word)}
          className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(word)}
          className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
