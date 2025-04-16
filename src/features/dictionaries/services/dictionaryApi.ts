import { createApi } from '@reduxjs/toolkit/query/react';
import { Dictionary, NewDictionary } from '../types/Dictionary';
import axiosBaseQuery from '../../../shared/utils/axiosBaseQuery';

export const dictionaryApi = createApi({
  reducerPath: 'dictionaryApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Dictionary'],
  endpoints: (builder) => ({
    // GET /dictionaries (user-owned)
    getUserDictionaries: builder.query<Dictionary[], void>({
      query: () => ({
        url: '/dictionaries',
        method: 'GET',
      }),
      providesTags: ['Dictionary'],
    }),

    // GET /dictionaries/all
    getAllDictionaries: builder.query<Dictionary[], void>({
      query: () => ({
        url: '/dictionaries/all',
        method: 'GET',
      }),
    }),

    // POST /dictionaries
    createDictionary: builder.mutation<Dictionary, NewDictionary>({
      query: (body) => ({
        url: '/dictionaries',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Dictionary'],
    }),

    // DELETE /dictionaries/:id
    deleteDictionary: builder.mutation<{ id: number }, number>({
      query: (id) => ({
        url: `/dictionaries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dictionary'],
    }),
  }),
});

export const {
  useGetUserDictionariesQuery,
  useGetAllDictionariesQuery,
  useCreateDictionaryMutation,
  useDeleteDictionaryMutation,
} = dictionaryApi;
