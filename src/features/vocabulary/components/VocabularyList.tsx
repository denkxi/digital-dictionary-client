import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useGetWordsQuery } from '../services/vocabularyApi';
import { setFilter, selectFilter, selectFilteredWords } from '../services/vocabularySlice';
import { WordsFilter } from '../types/vocabulary';
import WordCard from './WordCard';

const VocabularyList = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectFilter);
  
  // TODO: Implement authorization
  const userId = 'user-1';
  
  const { isLoading: isLoadingWords, error: wordsError } = useGetWordsQuery(userId);
  
  const filteredWords = useAppSelector(selectFilteredWords);

  const handleFilterChange = (newFilterValues: Partial<WordsFilter>) => {
    dispatch(setFilter(newFilterValues));
  };

//   if (isLoadingWords) {
//     return <div className="flex justify-center p-8">Loading vocabulary...</div>;
//   }

  if (wordsError) {
    return <div className="text-red-500 p-4">
      Error loading vocabulary. Please try again later.
    </div>;
  }

  return (
    <div>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filter.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="Search words..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="learned-status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="learned-status"
              value={filter.learnedStatus}
              onChange={(e) => handleFilterChange({ 
                learnedStatus: e.target.value as 'all' | 'learned' | 'notLearned' 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Words</option>
              <option value="learned">Learned</option>
              <option value="notLearned">Not Learned</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort-by"
              value={filter.sortBy}
              onChange={(e) => handleFilterChange({ 
                sortBy: e.target.value as 'createdAt' | 'alphabetical' 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt">Date Added</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <select
              id="sort-order"
              value={filter.sortOrder}
              onChange={(e) => handleFilterChange({ 
                sortOrder: e.target.value as 'asc' | 'desc' 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {filteredWords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filter.search 
            ? `No words found matching "${filter.search}"`
            : "No words added yet. Start by adding your first word!"}
        </div>
      ) : (
        <div>
          <div className="mb-4 text-gray-600">
            Showing {filteredWords.length} word{filteredWords.length !== 1 ? 's' : ''}
          </div>
          <div className="space-y-4">
            {filteredWords.map(word => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyList;