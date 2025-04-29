import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../shared/utils/axiosBaseQuery";
import { NewWordCategory, WordCategory } from "../types/WordCategory";

export const wordCategoryApi = createApi({
  reducerPath: "wordCategoryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["WordCategory"],
  endpoints: (builder) => ({
    // GET /word-categories
    getWordCategories: builder.query<WordCategory[], void>({
      query: () => ({
        url: "/word-categories",
        method: "GET",
      }),
      providesTags: ["WordCategory"],
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
  useCreateWordCategoryMutation,
  useDeleteWordCategoryMutation,
  useUpdateWordCategoryMutation,
} = wordCategoryApi;
