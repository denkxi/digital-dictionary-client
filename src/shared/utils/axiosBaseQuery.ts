import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { persistor, store } from '../../app/store';
import { logout, setCredentials } from '../../features/auth/slices/authSlice';
import { resetStore } from '../../app/logoutActions';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});


const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    const token = store.getState().auth.token;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const result = await axiosInstance({ url, method, data, params, headers });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      if (err.response?.status === 401) {
        try {
          const refreshResponse = await axiosInstance.post('/auth/refresh');
          const newToken = (refreshResponse.data as any).token;

          const { user } = store.getState().auth;
          if (!user) {
            throw new Error('User not found');
          }

          // Update auth slice with new token
          store.dispatch(setCredentials({
            user: user,
            token: newToken
          }));


          // Retry original request with new token
          const retryResult = await axiosInstance({
            url,
            method,
            data,
            params,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`
            }
          });

          return { data: retryResult.data };
        }
        catch (refreshError) {
          // If refresh fails - full logout
          store.dispatch(logout());
          store.dispatch(resetStore());
          await persistor.purge();

          return {
            error: {
              status: 401,
              data: 'Session expired. Please log in again.'
            }
          };
        }
      } 

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
