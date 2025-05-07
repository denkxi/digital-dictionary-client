import { WordClass } from '../types/Word';
import { FiSearch } from 'react-icons/fi';

type Props = {
  searchValue: string;
  onSearchChange: (val: string) => void;

  selectedClasses: WordClass[];
  onToggleClass: (cls: WordClass) => void;

  showStarred: boolean;
  onToggleStarred: () => void;

  showLearned: boolean;
  onToggleLearned: () => void;

  sortValue: string;
  onSortChange: (val: string) => void;

  sortOptions: { value: string; label: string }[];
};

export default function WordSearchBar({
  searchValue,
  onSearchChange,
  selectedClasses,
  onToggleClass,
  showStarred,
  onToggleStarred,
  showLearned,
  onToggleLearned,
  sortValue,
  onSortChange,
  sortOptions,
}: Props) {
  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm px-4 py-4 space-y-4 mb-6">
      {/* Search */}
      <div className="relative w-full md:max-w-md">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search words..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm text-text shadow-sm focus:outline-none focus:ring-1 focus:ring-title focus:border-title"
        />
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Sort */}
      <div className="ml-auto w-full md:w-auto">
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-1 focus:ring-title focus:border-title"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center text-sm">

        {/* Word Class filter */}
        <div className="flex flex-wrap gap-2">
          {Object.values(WordClass).map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => onToggleClass(cls)}
              className={`px-3 py-1 rounded-full border text-xs cursor-pointer ${
                selectedClasses.includes(cls)
                  ? 'bg-primary-2 border-primary-2 text-title font-medium'
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleStarred}
            className={`px-3 py-1 rounded-full border text-xs cursor-pointer ${
              showStarred
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800 font-medium'
                : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            ⭐ Starred
          </button>
          <button
            type="button"
            onClick={onToggleLearned}
            className={`px-3 py-1 rounded-full border text-xs cursor-pointer ${
              showLearned
                ? 'bg-green-100 border-green-300 text-green-800 font-medium'
                : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            ✓ Learned
          </button>
        </div>

      </div>
    </div>
  );
}
