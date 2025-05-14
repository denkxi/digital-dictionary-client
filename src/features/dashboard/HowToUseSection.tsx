import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiZap } from 'react-icons/fi';

export default function HowToUseSection() {
  const [open, setOpen] = useState(false);

  return (
    <section
      onClick={() => setOpen(!open)}
      className="bg-white border border-primary-2 rounded-3xl shadow p-5 sm:p-6 transition-all space-y-4 cursor-pointer hover:shadow-md"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 text-title font-semibold text-lg sm:text-xl">
          <FiZap className="text-primary-2 text-2xl" />
          How to Use This App
        </div>
        {open ? (
          <FiChevronUp className="text-xl text-gray-500 transition-transform" />
        ) : (
          <FiChevronDown className="text-xl text-gray-500 transition-transform" />
        )}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`transition-all duration-300 overflow-hidden ${
          open ? 'max-h-[1000px] opacity-100 pt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 pl-1">
          <li>Create categories to organize vocabulary thematically.</li>
          <li>Add dictionaries for each language you're learning.</li>
          <li>Add words with translations, examples, and definitions.</li>
          <li>Mark words as learned or starred to track progress.</li>
          <li>Take quizzes and review your learning statistics.</li>
        </ul>
      </div>
    </section>
  );
}
