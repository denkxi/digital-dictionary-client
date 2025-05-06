import { FiSearch } from 'react-icons/fi';

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: { value: string; label: string }[];
};

export default function CategorySearchBar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  sortOptions,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Search */}
      <div className="relative w-full md:max-w-xs">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search categories..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm text-text shadow-sm focus:outline-none focus:ring-1 focus:ring-title focus:border-title"
        />
        <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Sort */}
      <div className="w-full md:w-auto">
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2 text-sm text-text shadow-sm focus:outline-none focus:ring-1 focus:ring-title focus:border-title"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
