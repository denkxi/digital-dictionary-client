import { useNavigate } from "react-router-dom";
import { Dictionary } from "../types/Dictionary";
import Button from "../../../shared/components/Button";
import { FiBookOpen, FiArrowRight } from "react-icons/fi";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";

type Props = {
  dictionary: Dictionary;
  onEdit: (dictionary: Dictionary) => void;
  onDelete: (dictionary: Dictionary) => void;
};

export default function DictionaryCard({
  dictionary,
  onEdit,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const { name, sourceLanguage, targetLanguage, description, createdAt } =
    dictionary;

  return (
    <div className="w-[300px] flex flex-col justify-between border border-primary-1 rounded-2xl p-4 shadow-sm bg-white hover:shadow-md transition select-none">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-title">
          <FiBookOpen className="text-xl" />
          <h3 className="text-xl font-bold">{name}</h3>
        </div>

        <div className="text-sm font-medium text-gray-700">
          {sourceLanguage} → {targetLanguage}
        </div>

        {description && <p className="text-sm text-gray-600">{description}</p>}

        <div className="text-xs text-gray-400">
          Created: {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex flex-col pt-4">
        <Button
          variant="primary"
          onClick={() => navigate(`/dictionaries/${dictionary.id}`)}
          className="flex items-center justify-center gap-2 w-full"
        >
          <FiArrowRight /> View Words
        </Button>

        <div className="flex gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={() => onEdit(dictionary)}
            className="flex items-center gap-1 w-1/2 justify-center"
          >
            <FaRegEdit /> Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(dictionary)}
            className="flex items-center gap-1 w-1/2 justify-center"
          >
            <FaRegTrashAlt /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
