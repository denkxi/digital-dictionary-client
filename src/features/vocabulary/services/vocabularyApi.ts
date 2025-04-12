import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Word, Category } from '../types/vocabulary';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3000/api/', 
    // In a real app, include authentication headers
    // prepareHeaders: (headers, { getState }) => {
    //   const token = (getState() as RootState).auth.token;
    //   if (token) {
    //     headers.set('authorization', `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  tagTypes: ['Words', 'Categories'],
  endpoints: (builder) => ({
    // Get all words for a user
    getWords: builder.query<Word[], string>({
      query: (userId) => `users/${userId}/words`,
      transformResponse: () => {
        return [
          {
            id: '1',
            word: 'apple',
            translation: 'õun',
            categoryId: 'food',
            examples: ['I ate an apple', 'The apple is red'],
            notes: 'Common fruit',
            createdAt: new Date().toISOString(),
            learned: false
          },
          {
            id: '2',
            word: 'book',
            translation: 'raamat',
            categoryId: 'education',
            examples: ['I read a book', 'The book is on the table'],
            notes: '',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            learned: true
          }
        ] as Word[];
      },
      providesTags: ['Words']
    }),
    
    // Add a new word
    addWord: builder.mutation<Word, Omit<Word, 'id' | 'createdAt'> & { userId: string }>({
      query: ({ userId, ...word }) => ({
        url: `users/${userId}/words`,
        method: 'POST',
        body: word,
      }),
      transformResponse: (_response, meta, arg) => {
        // Create a new word object with ID and createdAt
        const newWord: Word = {
          ...arg,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        // Remove the userId as it's not part of the Word type
        const { userId, ...wordWithoutUserId } = newWord as (Word & { userId: string });
        return wordWithoutUserId;
      },
      invalidatesTags: ['Words'],
    }),
    
    // Update a word
    updateWord: builder.mutation<Word, Partial<Word> & { id: string; userId: string }>({
      query: ({ userId, id, ...patch }) => ({
        url: `users/${userId}/words/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Words'],
    }),
    
    // Delete a word
    deleteWord: builder.mutation<void, { id: string; userId: string }>({
      query: ({ userId, id }) => ({
        url: `users/${userId}/words/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Words'],
    }),
    
    // Get categories
    getCategories: builder.query<Category[], string>({
      query: (userId) => `users/${userId}/categories`,
      // Mock data temporarily
      transformResponse: () => {
        return [
          {
            id: 'food',
            name: 'Food',
            description: 'Food and drinks vocabulary'
          },
          {
            id: 'education',
            name: 'Education',
            description: 'School and education related words'
          },
          {
            id: 'travel',
            name: 'Travel',
            description: 'Words related to traveling'
          }
        ] as Category[];
      },
      providesTags: ['Categories']
    }),
  }),
});

export const {
  useGetWordsQuery,
  useAddWordMutation,
  useUpdateWordMutation,
  useDeleteWordMutation,
  useGetCategoriesQuery
} = api;