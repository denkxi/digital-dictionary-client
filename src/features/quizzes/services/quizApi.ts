import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../shared/utils/axiosBaseQuery";
import {
  Quiz,
  Question,
  QuizResultSummary,
  QuestionType,
  QuizWithName,
} from "../types/quizTypes";

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Quiz"],
  endpoints: (builder) => ({
    // Start a new quiz
    createQuiz: builder.mutation<
      { quiz: Quiz; questions: Question[] },
      {
        dictionaryId: string;
        questionType: QuestionType;
        wordCount: number;
      }
    >({
      query: (body) => ({
        url: "/quizzes",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Quiz"],
    }),

    getQuizById: builder.query<
      { quiz: QuizWithName; questions: Question[] },
      string
    >({
      query: (quizId) => ({
        url: `/quizzes/${quizId}`,
        method: "GET",
      }),
    }),

    // Submit quiz answers
    submitQuiz: builder.mutation<
      {
        result: QuizResultSummary;
        questions: Question[];
      },
      {
        quizId: string;
        answers: { questionId: string; answer: string }[];
      }
    >({
      query: ({ quizId, answers }) => ({
        url: `/quizzes/${quizId}/submit`,
        method: "POST",
        data: { answers },
      }),
      invalidatesTags: ["Quiz"],
    }),

    // View quiz result
    getQuizResult: builder.query<
      {
        quiz: QuizWithName;
        questions: Question[];
      },
      string
    >({
      query: (quizId) => ({
        url: `/quizzes/${quizId}/result`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),

    // All quizzes
    getAllQuizzes: builder.query<QuizWithName[], void>({
      query: () => ({
        url: "/quizzes",
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
    // Unfinished only
    getUnfinishedQuizzes: builder.query<QuizWithName[], void>({
      query: () => ({
        url: "/quizzes/unfinished",
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
    // Completed only
    getCompletedQuizzes: builder.query<QuizWithName[], void>({
      query: () => ({
        url: "/quizzes/completed",
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
  }),
});

export const {
  useCreateQuizMutation,
  useGetQuizByIdQuery,
  useSubmitQuizMutation,
  useGetQuizResultQuery,
  useGetAllQuizzesQuery,
  useGetUnfinishedQuizzesQuery,
  useGetCompletedQuizzesQuery,
} = quizApi;
