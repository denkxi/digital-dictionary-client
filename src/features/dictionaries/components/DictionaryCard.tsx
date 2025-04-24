import { useNavigate } from "react-router-dom";
import { Dictionary } from "../types/Dictionary";

type Props = {
  dictionary: Dictionary;
};

export default function DictionaryCard({ dictionary }: Props) {
  const navigate = useNavigate();
  const { name, sourceLanguage, targetLanguage, description, createdAt } = dictionary;

  return (
    <div 
    onClick={() => navigate(`/dictionaries/${dictionary.id}`)}
    className="border border-primary-1 rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer transition">
      <div className="text-2xl font-semibold text-text mb-1">
        {name}
      </div>
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
  );
}
