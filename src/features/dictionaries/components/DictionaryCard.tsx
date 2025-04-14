import { useNavigate } from "react-router-dom";

type Props = {
  dictionary: {
    id: number;
    sourceLanguage: string;
    targetLanguage: string;
    description?: string;
    createdAt: string;
  };
};

export default function DictionaryCard({ dictionary }: Props) {
  const navigate = useNavigate();
  const { sourceLanguage, targetLanguage, description, createdAt } = dictionary;

  return (
    <div 
    onClick={() => navigate(`/dictionaries/${dictionary.id}`)}
    className="border border-primary-1 rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer transition">
      <div className="text-lg font-semibold text-text mb-1">
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
