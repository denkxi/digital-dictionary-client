import { createApi } from '@reduxjs/toolkit/query/react';
import { NewWord, PaginatedWordResponse, Word, WordFilters } from '../types/Word';
import axiosBaseQuery from '../../../shared/utils/axiosBaseQuery';

export const wordApi = createApi({
  reducerPath: 'wordApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Word'],
  endpoints: (builder) => ({
    // GET /words?dictionaryId=:id
    getWordsByDictionary: builder.query<PaginatedWordResponse, WordFilters>({
      query: ({ dictionaryId, search = '', wordClass, starred, learned, sort = 'name-asc', page = 1, limit = 10 }) => ({
        url: '/words',
        method: 'GET',
        params: {
          dictionaryId,
          search,
          sort,
          page,
          limit,
          ...(wordClass?.length ? { wordClass } : {}),
          ...(starred ? { starred: true } : {}),
          ...(learned ? { learned: true } : {}),
        },
      }),
      providesTags: ['Word'],
    }),

    // GET /words/by-ids?ids=a,b,c
    getWordsByIds: builder.query<Word[], string[]>({
      query: (ids) => ({
        url: '/words/by-ids',
        method: 'GET',
        params: { ids: ids.join(',') },
      }),
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
  useGetWordsByIdsQuery,
  useCreateWordMutation,
  useDeleteWordMutation,
  useUpdateWordMutation,
} = wordApi;
