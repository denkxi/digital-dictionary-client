import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../../../shared/utils/axiosBaseQuery';
import { NewWordCategory, WordCategory } from '../types/WordCategory';

export const wordCategoryApi = createApi({
  reducerPath: 'wordCategoryApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['WordCategory'],
  endpoints: (builder) => ({
    // GET /word-categories
    getWordCategories: builder.query<WordCategory[], void>({
      query: () => ({
        url: '/word-categories',
        method: 'GET'
      }),
      providesTags: ['WordCategory']
    }),

    // POST /word-categories
    createWordCategory: builder.mutation<WordCategory, NewWordCategory>({
      query: (body) => ({
        url: '/word-categories',
        method: 'POST',
        data: body
      }),
      invalidatesTags: ['WordCategory']
    }),

    // (optional) DELETE /word-categories/:id
    deleteWordCategory: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/word-categories/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['WordCategory']
    }),

    // (optional) PUT /word-categories/:id
    updateWordCategory: builder.mutation<WordCategory, Partial<WordCategory> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/word-categories/${id}`,
        method: 'PUT',
        data: body
      }),
      invalidatesTags: ['WordCategory']
    })
  })
});

export const {
  useGetWordCategoriesQuery,
  useCreateWordCategoryMutation,
  useDeleteWordCategoryMutation,
  useUpdateWordCategoryMutation
} = wordCategoryApi;
