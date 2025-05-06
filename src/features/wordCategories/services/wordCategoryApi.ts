import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../shared/utils/axiosBaseQuery";
import { NewWordCategory, WordCategory, WordCategoryResponse, WordCategorySearch } from "../types/WordCategory";

export const wordCategoryApi = createApi({
  reducerPath: "wordCategoryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["WordCategory"],
  endpoints: (builder) => ({
    // GET /word-categories
    getWordCategories: builder.query<WordCategoryResponse, WordCategorySearch>({
      query: ({ search = '', sort = 'name-asc', page = 1, limit = 10 }) => ({
        url: '/word-categories',
        method: 'GET',
        params: { search, sort, page, limit },
      }),
      providesTags: ['WordCategory'],
    }),

    // GET /word-categories without pagination (for word form)
    getAllWordCategories: builder.query<WordCategoryResponse, void>({
      query: () => ({
        url: '/word-categories',
        method: 'GET',
        params: { limit: 9999 },
      }),
    }),    
    

    // POST /word-categories
    createWordCategory: builder.mutation<WordCategory, NewWordCategory>({
      query: (body) => ({
        url: "/word-categories",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["WordCategory"],
    }),

    // PATCH /word-categories/:id
    updateWordCategory: builder.mutation<WordCategory, { id: string; data: Partial<WordCategory> }>({
      query: ({ id, data }) => ({
        url: `/word-categories/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["WordCategory"],
    }),

    // DELETE /word-categories/:id
    deleteWordCategory: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/word-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WordCategory"],
    }),
  }),
});

export const {
  useGetWordCategoriesQuery,
  useGetAllWordCategoriesQuery,
  useCreateWordCategoryMutation,
  useDeleteWordCategoryMutation,
  useUpdateWordCategoryMutation,
} = wordCategoryApi;
