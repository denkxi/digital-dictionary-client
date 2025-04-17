import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../../../shared/utils/axiosBaseQuery';
import { Quiz, Question, QuizResultSummary, QuestionType } from '../types/quizTypes';

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Quiz'],
  endpoints: (builder) => ({
    // Start a new quiz
    createQuiz: builder.mutation<{ quiz: Quiz; questions: Question[] }, {
      dictionaryId: number;
      questionType: QuestionType;
      wordCount: number;
    }>({
      query: (body) => ({
        url: '/quizzes',
        method: 'POST',
        data: body
      }),
      invalidatesTags: ['Quiz']
    }),

    // Submit quiz answers
    submitQuiz: builder.mutation<{
      result: QuizResultSummary;
      questions: Question[];
    }, {
      quizId: number;
      answers: { questionId: number; answer: string }[];
    }>({
      query: ({ quizId, answers }) => ({
        url: `/quizzes/${quizId}/submit`,
        method: 'POST',
        data: { answers }
      }),
      invalidatesTags: ['Quiz']
    }),

    // View quiz result
    getQuizResult: builder.query<{
      quiz: Quiz;
      questions: Question[];
    }, number>({
      query: (quizId) => ({
        url: `/quizzes/${quizId}/result`,
        method: 'GET'
      }),
      providesTags: ['Quiz']
    }),

    // Get user’s quiz history (to implement later)
    getQuizHistory: builder.query<Quiz[], void>({
      query: () => ({
        url: '/quizzes/history',
        method: 'GET'
      }),
      providesTags: ['Quiz']
    })
  })
});

export const {
  useCreateQuizMutation,
  useSubmitQuizMutation,
  useGetQuizResultQuery,
  useGetQuizHistoryQuery
} = quizApi;
