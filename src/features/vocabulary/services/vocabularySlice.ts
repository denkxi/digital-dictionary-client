import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Word, WordsFilter } from '../types/vocabulary';
import { RootState } from '../../../app/store';


interface VocabularyState {
  words: Word[];
  filter: WordsFilter;
  loading: boolean;
  error: string | null;
}

const initialState: VocabularyState = {
  words: [],
  filter: {
    search: '',
    categoryId: undefined,
    learnedStatus: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  loading: false,
  error: null
};

const vocabularySlice = createSlice({
  name: 'vocabulary',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setWords: (state, action: PayloadAction<Word[]>) => {
      state.words = action.payload;
    },
    
    addWord: (state, action: PayloadAction<Word>) => {
      state.words.push(action.payload);
    },
    
    updateWord: (state, action: PayloadAction<Word>) => {
      const index = state.words.findIndex(word => word.id === action.payload.id);
      if (index !== -1) {
        state.words[index] = action.payload;
      }
    },
    
    markWordAsLearned: (state, action: PayloadAction<string>) => {
      const word = state.words.find(word => word.id === action.payload);
      if (word) {
        word.learned = true;
      }
    },
    
    removeWord: (state, action: PayloadAction<string>) => {
      state.words = state.words.filter(word => word.id !== action.payload);
    },
    
    setFilter: (state, action: PayloadAction<Partial<WordsFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
    }
  }
});

export const {
  setLoading,
  setError,
  setWords,
  addWord,
  updateWord,
  markWordAsLearned,
  removeWord,
  setFilter
} = vocabularySlice.actions;

export const selectWords = (state: RootState) => state.vocabulary.words;
export const selectError = (state: RootState) => state.vocabulary.error;
export const selectFilter = (state: RootState) => state.vocabulary.filter;

export const selectFilteredWords = (state: RootState) => {
  const { words } = state.vocabulary;
  const { search, categoryId, learnedStatus, sortBy, sortOrder } = state.vocabulary.filter;
  
  let filtered = words;
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(word => 
      word.word.toLowerCase().includes(searchLower) || 
      word.translation.toLowerCase().includes(searchLower)
    );
  }
  
  if (categoryId) {
    filtered = filtered.filter(word => word.categoryId === categoryId);
  }
  
  if (learnedStatus === 'learned') {
    filtered = filtered.filter(word => word.learned);
  } else if (learnedStatus === 'notLearned') {
    filtered = filtered.filter(word => !word.learned);
  }
  
  if (sortBy) {
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return sortOrder === 'asc' 
          ? a.word.localeCompare(b.word) 
          : b.word.localeCompare(a.word);
      } else if (sortBy === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }
  
  return filtered;
};

export default vocabularySlice.reducer;