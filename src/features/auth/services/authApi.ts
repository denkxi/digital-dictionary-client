import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../../../shared/utils/axiosBaseQuery';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest
} from '../types/Auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials
      })
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (user) => ({
        url: '/auth/register',
        method: 'POST',
        data: user
      })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation
} = authApi;
