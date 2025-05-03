import Button from "../../../shared/components/Button";
import { Word } from "../types/Word";
import {
  FiGlobe,
  FiVolume2,
  FiBookOpen,
  FiMessageCircle,
  FiTag,
  FiStar,
  FiCheckCircle,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

type Props = {
  word: Word;
  onEdit: (word: Word) => void;
  onDelete: (word: Word) => void;
};

export default function WordItem({ word, onEdit, onDelete }: Props) {
  return (
    <div className="w-[300px] flex flex-col justify-between border border-primary-1 rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition">
      <div className="text-xl font-bold text-title mb-1">{word.writing}</div>

      <div className="text-base text-gray-700 flex items-center gap-2 mb-1">
        <FiGlobe className="text-gray-500" />
        {word.translation}
      </div>

      {word.pronunciation && (
        <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
          <FiVolume2 className="text-gray-500" />
          <em>{word.pronunciation}</em>
        </div>
      )}

      {word.definition && (
        <div className="text-sm text-gray-700 flex items-start gap-2 mb-1">
          <FiBookOpen className="text-gray-500 mt-0.5" />
          <span>{word.definition}</span>
        </div>
      )}

      {word.useExample && (
        <div className="text-sm text-gray-700 flex items-start gap-2 mb-1 italic">
          <FiMessageCircle className="text-gray-500 mt-0.5" />
          <span>"{word.useExample}"</span>
        </div>
      )}

      {word.wordClass && (
        <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
          <FiTag className="text-gray-500" />
          {word.wordClass}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {word.isStarred && (
          <div className="flex items-center text-yellow-600 text-sm gap-1 font-medium">
            <FiStar /> Starred
          </div>
        )}
        {word.isLearned && (
          <div className="flex items-center text-green-600 text-sm gap-1 font-medium">
            <FiCheckCircle /> Learned
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          variant="secondary"
          onClick={() => onEdit(word)}
          className="flex items-center gap-1 w-1/2 justify-center"
        >
          <FiEdit2 /> Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(word)}
          className="flex items-center gap-1 w-1/2 justify-center"
        >
          <FiTrash2 /> Delete
        </Button>
      </div>
    </div>
  );
}
