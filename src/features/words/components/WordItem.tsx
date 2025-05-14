import { useState, useEffect } from "react";
import Button from "../../../shared/components/Button";
import { Word } from "../types/Word";
import {
  FiGlobe,
  FiVolume2,
  FiBookOpen,
  FiMessageCircle,
  FiTag,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  FaRegStar,
  FaStar,
  FaRegCheckCircle,
  FaCheckCircle,
  FaRegEdit,
} from "react-icons/fa";

interface Props {
  word: Word;
  onEdit: (word: Word) => void;
  onToggleStarred: (word: Word) => void;
  onToggleLearned: (word: Word) => void;
}

export default function WordItem({ word, onEdit, onToggleStarred, onToggleLearned }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const shouldCollapse = isMobile;

  return (
    <div
      className="relative w-full max-w-[300px] h-full flex flex-col justify-between border border-primary-1 rounded-2xl shadow-sm bg-white hover:shadow-md transition overflow-hidden text-sm cursor-pointer"
      onClick={() => shouldCollapse && setIsOpen((prev) => !prev)}
    >
      {/* Header: Always visible */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xl font-bold text-title">{word.writing}</div>
            {word.translation && (
              <div className="text-gray-500 mt-0.5">{word.translation}</div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStarred(word);
                }}
                className="text-yellow-500 hover:text-yellow-600 transition-all cursor-pointer hover:scale-105 text-xl"
                title="Toggle Starred"
              >
                {word.isStarred ? <FaStar /> : <FaRegStar />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLearned(word);
                }}
                className="text-green-600 hover:text-green-700 transition-all cursor-pointer hover:scale-105 text-xl"
                title="Toggle Learned"
              >
                {word.isLearned ? <FaCheckCircle /> : <FaRegCheckCircle />}
              </button>
            </div>
            {shouldCollapse && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen((prev) => !prev);
                }}
                className="text-gray-500 hover:text-title text-base"
                title={isOpen ? "Collapse" : "Expand"}
              >
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Section (or always open on larger screens) */}
      <div
        className={`transition-all duration-300 px-4 pt-0 pb-4 text-gray-700 space-y-2 flex-grow flex flex-col justify-between ${
          shouldCollapse ? (isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0") : "opacity-100"
        } overflow-hidden`}
      >
        <div className="space-y-2">
          {word.pronunciation && (
            <div className="flex items-center gap-2">
              <FiVolume2 className="text-gray-500" />
              <em>{word.pronunciation}</em>
            </div>
          )}

          {word.definition && (
            <div className="flex items-start gap-2">
              <FiBookOpen className="text-gray-500 mt-0.5" />
              <span>{word.definition}</span>
            </div>
          )}

          {word.useExample && (
            <div className="flex items-start gap-2 italic">
              <FiMessageCircle className="text-gray-500 mt-0.5" />
              <span>"{word.useExample}"</span>
            </div>
          )}

          {word.wordClass && (
            <div className="flex items-center gap-2">
              <FiTag className="text-gray-500" />
              <span>{word.wordClass}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 mt-auto">
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(word);
            }}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            aria-label="Edit word"
          >
            <FaRegEdit className="text-base" />
          </Button>
        </div>
      </div>
    </div>
  );
}
