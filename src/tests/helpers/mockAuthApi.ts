import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../features/auth/types/Auth';

export const mockAuthApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (user) => ({
        url: '/auth/register',
        method: 'POST',
        body: user
      })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation
} = mockAuthApi;
