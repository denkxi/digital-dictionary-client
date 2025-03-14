// src/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://your-api-url.com' }),
  endpoints: (builder) => ({
    getExample: builder.query<number, string>({
      query: (arg) => `endpoint/${arg}`,
    }),
    // Add other endpoints here
  }),
});

export const { useGetExampleQuery } = apiSlice;
