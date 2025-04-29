import { createApi } from '@reduxjs/toolkit/query/react';
import { NewWord, Word } from '../types/Word';
import axiosBaseQuery from '../../../shared/utils/axiosBaseQuery';

export const wordApi = createApi({
  reducerPath: 'wordApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Word'],
  endpoints: (builder) => ({
    // GET /words?dictionaryId=:id
    getWordsByDictionary: builder.query<Word[], string>({
      query: (dictionaryId) => ({
        url: `/words?dictionaryId=${dictionaryId}`,
        method: 'GET',
      }),
      providesTags: ['Word'],
    }),

    // POST /words
    createWord: builder.mutation<Word, NewWord>({
      query: (body) => ({
        url: '/words',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Word'],
    }),

    // DELETE /words/:id
    deleteWord: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/words/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Word'],
    }),

    // PATCH /words/:id
    updateWord: builder.mutation<Word, { id: string; data: Partial<Word> }>({
      query: ({ id, data }) => ({
        url: `/words/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Word'],
    }),
  }),
});

export const {
  useGetWordsByDictionaryQuery,
  useCreateWordMutation,
  useDeleteWordMutation,
  useUpdateWordMutation,
} = wordApi;
