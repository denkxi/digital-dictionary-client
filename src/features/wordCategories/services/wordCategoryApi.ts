import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../../../shared/utils/axiosBaseQuery';
import { WordCategory } from '../types/WordCategory';

export const wordCategoryApi = createApi({
  reducerPath: 'wordCategoryApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['WordCategory'],
  endpoints: (builder) => ({
    // GET /categories
    getWordCategories: builder.query<WordCategory[], void>({
      query: () => ({
        url: '/categories',
        method: 'GET'
      }),
      providesTags: ['WordCategory']
    }),

    // POST /categories
    createWordCategory: builder.mutation<WordCategory, Partial<Omit<WordCategory, 'id' | 'createdAt'>>>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        data: body
      }),
      invalidatesTags: ['WordCategory']
    }),

    // (optional) DELETE /categories/:id
    deleteWordCategory: builder.mutation<{ id: number }, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['WordCategory']
    }),

    // (optional) PUT /categories/:id
    updateWordCategory: builder.mutation<WordCategory, Partial<WordCategory> & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
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
