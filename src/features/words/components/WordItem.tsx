import Button from "../../../shared/components/Button";
import { Word } from "../types/Word";
import {
  FiGlobe,
  FiVolume2,
  FiBookOpen,
  FiMessageCircle,
  FiTag,
} from "react-icons/fi";
import {
  FaRegStar,
  FaStar,
  FaRegCheckCircle,
  FaCheckCircle,
  FaRegEdit,
} from "react-icons/fa";

type Props = {
  word: Word;
  onEdit: (word: Word) => void;
  onToggleStarred: (word: Word) => void;
  onToggleLearned: (word: Word) => void;
};

export default function WordItem({
  word,
  onEdit,
  onToggleStarred,
  onToggleLearned,
}: Props) {
  return (
    <div className="relative w-[300px] flex flex-col justify-between border border-primary-1 rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition">
      <div className="absolute top-3 right-3 flex gap-3">
        <button
          onClick={() => onToggleStarred(word)}
          className="text-yellow-500 hover:text-yellow-600 transition-all cursor-pointer hover:scale-105 text-2xl"
          title="Toggle Starred"
        >
          {word.isStarred ? <FaStar /> : <FaRegStar />}
        </button>
        <button
          onClick={() => onToggleLearned(word)}
          className="text-green-600 hover:text-green-700 transition-all cursor-pointer hover:scale-105 text-2xl"
          title="Toggle Learned"
        >
          {word.isLearned ? <FaCheckCircle /> : <FaRegCheckCircle />}
        </button>
      </div>

      <div className="text-3xl font-bold text-title mb-1">{word.writing}</div>

      <div className="text-xl text-gray-700 flex items-center gap-2 mb-1">
        <FiGlobe className="text-gray-500" />
        <span className="text-sm">{word.translation}</span>
      </div>

      {word.pronunciation && (
        <div className="text-xl text-gray-600 flex items-center gap-2 mb-1">
          <FiVolume2 className="text-gray-500" />
          <em className="text-sm">{word.pronunciation}</em>
        </div>
      )}

      {word.definition && (
        <div className="text-xl text-gray-700 flex items-start gap-2 mb-1">
          <FiBookOpen className="text-gray-500 mt-0.5" />
          <span className="text-sm">{word.definition}</span>
        </div>
      )}

      {word.useExample && (
        <div className="text-xl text-gray-700 flex items-start gap-2 mb-1 italic">
          <FiMessageCircle className="text-gray-500 mt-0.5" />
          <span className="text-sm">"{word.useExample}"</span>
        </div>
      )}

      {word.wordClass && (
        <div className="text-xl text-gray-600 flex items-center gap-2 mb-1">
          <FiTag className="text-gray-500" />
          <span className="text-sm">{word.wordClass}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {word.isStarred && (
          <div className="flex items-center text-yellow-600 text-sm gap-1 font-medium">
            <FaStar /> Starred
          </div>
        )}
        {word.isLearned && (
          <div className="flex items-center text-green-600 text-sm gap-1 font-medium">
            <FaCheckCircle /> Learned
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          variant="secondary"
          onClick={() => onEdit(word)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          aria-label="Edit word"
        >
          <FaRegEdit className="text-lg" />
        </Button>
      </div>
    </div>
  );
}
