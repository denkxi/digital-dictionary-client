import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../shared/utils/axiosBaseQuery";
import { DictionaryStats, UserSummary } from "../types/Statistics";

export const statisticsApi = createApi({
  reducerPath: "statisticsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Statistics"],
  endpoints: (builder) => ({
    // GET /api/statistics/user-summary
    getUserSummary: builder.query<UserSummary, void>({
      query: () => ({
        url: "/statistics/user-summary",
        method: "GET",
      }),
      providesTags: ["Statistics"],
    }),

    getDictionarySummary: builder.query<DictionaryStats, string>({
      query: (dictionaryId) => ({
        url: "/statistics/dictionary-summary",
        method: "GET",
        params: { dictionaryId },
      }),
      providesTags: ["Statistics"],
    }),
  }),

});

export const {
  useGetUserSummaryQuery,
  useGetDictionarySummaryQuery,
} = statisticsApi;
