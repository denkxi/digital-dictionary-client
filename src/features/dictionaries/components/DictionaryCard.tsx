import { useNavigate } from "react-router-dom";
import { Dictionary } from "../types/Dictionary";

type Props = {
  dictionary: Dictionary;
  onEdit: (dictionary: Dictionary) => void;
  onDelete: (dictionary: Dictionary) => void;
};

export default function DictionaryCard({ dictionary, onEdit, onDelete }: Props) {
  const navigate = useNavigate();
  const { name, sourceLanguage, targetLanguage, description, createdAt } = dictionary;

  return (
    <div className="relative border border-primary-1 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition">
      <div
        onClick={() => navigate(`/dictionaries/${dictionary.id}`)}
        className="cursor-pointer"
      >
        <div className="text-2xl font-semibold text-text mb-1">{name}</div>
        <div className="text-lg font-semibold text-text/80 mb-1">
          {sourceLanguage} → {targetLanguage}
        </div>
        {description && (
          <p className="text-sm text-gray-600 mb-2">{description}</p>
        )}
        <div className="text-xs text-gray-500">
          Created at: {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => onEdit(dictionary)}
          className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(dictionary)}
          className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
