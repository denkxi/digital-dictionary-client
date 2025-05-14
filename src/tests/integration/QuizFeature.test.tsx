import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, Reducer } from '@reduxjs/toolkit';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import QuizPage from '../../features/quizzes/components/QuizPage';
import QuizRunner from '../../features/quizzes/components/QuizRunner';
import QuizResult from '../../features/quizzes/components/QuizResult';
import { Question, QuestionType, QuizWithName } from '../../features/quizzes/types/quizTypes';
import { quizReducer, QuizState } from '../../features/quizzes/services/quizReducer';

// Mock quiz data
const mockUnfinishedQuizzes: QuizWithName[] = [
  {
    id: 'quiz1',
    userId: 'user1',
    dictionaryId: 'dict1',
    dictionaryName: 'English Vocabulary',
    questionType: QuestionType.Translation,
    wordCount: 10,
    createdAt: '2023-01-01T00:00:00.000Z'
  }
];

const mockCompletedQuizzes: QuizWithName[] = [
  {
    id: 'quiz2',
    userId: 'user1',
    dictionaryId: 'dict1',
    dictionaryName: 'Spanish Basics',
    questionType: QuestionType.Mixed,
    wordCount: 5,
    createdAt: '2023-01-02T00:00:00.000Z',
    completedAt: '2023-01-02T00:30:00.000Z',
    result: {
      correctCount: 4,
      incorrectCount: 1,
      totalCount: 5,
      scorePercent: 80
    }
  }
];

const mockQuizQuestions: Question[] = [
  {
    id: 'q1',
    quizId: 'quiz1',
    wordId: 'word1',
    type: QuestionType.Translation,
    prompt: 'Translate "hello" to Spanish',
    choices: ['hola', 'adiós', 'gracias', 'por favor'],
    correctAnswer: 'hola'
  },
  {
    id: 'q2',
    quizId: 'quiz1',
    wordId: 'word2',
    type: QuestionType.Translation,
    prompt: 'Translate "goodbye" to Spanish',
    choices: ['hola', 'adiós', 'gracias', 'por favor'],
    correctAnswer: 'adiós'
  }
];

const mockQuizResult = {
  quiz: {
    id: 'quiz1',
    userId: 'user1',
    dictionaryId: 'dict1',
    dictionaryName: 'English Vocabulary',
    questionType: QuestionType.Translation,
    wordCount: 2,
    createdAt: '2023-01-01T00:00:00.000Z',
    completedAt: '2023-01-01T00:10:00.000Z',
    result: {
      correctCount: 1,
      incorrectCount: 1,
      totalCount: 2,
      scorePercent: 50
    }
  },
  questions: [
    {
      id: 'q1',
      quizId: 'quiz1',
      wordId: 'word1',
      type: QuestionType.Translation,
      prompt: 'Translate "hello" to Spanish',
      choices: ['hola', 'adiós', 'gracias', 'por favor'],
      correctAnswer: 'hola',
      userAnswer: 'hola',
      isCorrect: true
    },
    {
      id: 'q2',
      quizId: 'quiz1',
      wordId: 'word2',
      type: QuestionType.Translation,
      prompt: 'Translate "goodbye" to Spanish',
      choices: ['hola', 'adiós', 'gracias', 'por favor'],
      correctAnswer: 'adiós',
      userAnswer: 'gracias',
      isCorrect: false
    }
  ]
};

// Mock the quiz API
jest.mock('../../features/quizzes/services/quizApi', () => {
  return {
    useGetUnfinishedQuizzesQuery: () => ({
      data: mockUnfinishedQuizzes,
      isLoading: false,
      isError: false
    }),
    useGetCompletedQuizzesQuery: () => ({
      data: mockCompletedQuizzes,
      isLoading: false,
      isError: false
    }),
    useCreateQuizMutation: () => [
      jest.fn().mockImplementation((data) => 
        Promise.resolve({
          quiz: {
            id: 'new-quiz',
            ...data,
            createdAt: new Date().toISOString()
          },
          questions: mockQuizQuestions
        })
      ),
      { isLoading: false }
    ],
    useGetQuizByIdQuery: () => ({
      data: {
        quiz: mockUnfinishedQuizzes[0],
        questions: mockQuizQuestions
      },
      isLoading: false,
      isError: false
    }),
    useSubmitQuizMutation: () => [
      jest.fn().mockImplementation(({  }) => 
        Promise.resolve({
          result: {
            correctCount: 1,
            incorrectCount: 1,
            totalCount: 2,
            scorePercent: 50
          },
          questions: mockQuizResult.questions
        })
      ),
      { isLoading: false }
    ],
    useGetQuizResultQuery: () => ({
      data: mockQuizResult,
      isLoading: false,
      isError: false
    }),
    quizApi: {
      reducerPath: 'quizApi',
      reducer: () => ({}),
      middleware: () => (next: (arg0: any) => any) => (action: any) => next(action)
    }
  };
});

// Mock the getQuestionPrompt utility
jest.mock('../../features/quizzes/utils/getQuestionPrompt', () => ({
  getQuestionPrompt: (question: Question) => question.prompt
}));

// Setup store for testing
const createTestStore = () => 
  configureStore({
    reducer: {
      quiz: quizReducer as Reducer<QuizState>
    }
  });
// Wrap component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </Provider>
    ),
    store
  };
};

// For testing routes
const renderWithRouter = (initialRoute: string) => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/quizzes" element={<QuizPage />} />
            <Route path="/quizzes/:quizId" element={<QuizRunner />} />
            <Route path="/quizzes/:quizId/result" element={<QuizResult />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
    store
  };
};

describe('Quiz Feature Integration Tests', () => {
  test('renders quiz dashboard with unfinished and completed quizzes', () => {
    renderWithProviders(<QuizPage />);
    
    // Check if the component title is rendered
    expect(screen.getByText('Quiz Dashboard')).toBeInTheDocument();
    
    // Check if unfinished quizzes are displayed
    expect(screen.getByText('English Vocabulary')).toBeInTheDocument();
    
    // Check if completed quizzes are displayed
    expect(screen.getByText('Spanish Basics')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  test('renders quiz runner with questions', () => {
    // Mock useParams to return the quiz ID
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ quizId: 'quiz1' }),
      useNavigate: () => jest.fn()
    }));
    
    renderWithRouter('/quizzes/quiz1');
    
    // Check if the quiz title is rendered
    expect(screen.getByText('English Vocabulary Quiz')).toBeInTheDocument();
    
    // Check if the question is rendered
    expect(screen.getByText('Translate "hello" to Spanish')).toBeInTheDocument();
    
    // Check if the choices are rendered
    expect(screen.getByText('hola')).toBeInTheDocument();
    expect(screen.getByText('adiós')).toBeInTheDocument();
    expect(screen.getByText('gracias')).toBeInTheDocument();
    expect(screen.getByText('por favor')).toBeInTheDocument();
    
    // Check if the progress indicator is rendered
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  test('allows answering questions and navigates to next question', async () => {
    // Mock useParams and useNavigate
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ quizId: 'quiz1' }),
      useNavigate: () => mockNavigate
    }));
    
    renderWithRouter('/quizzes/quiz1');
    
    // Answer the first question
    fireEvent.click(screen.getByText('hola'));
    
    // Check if the second question is displayed
    await waitFor(() => {
      expect(screen.getByText('Translate "goodbye" to Spanish')).toBeInTheDocument();
    });
    
    // Answer the second question
    fireEvent.click(screen.getByText('adiós'));
    
    // Check if navigation to results page happens
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/quizzes/quiz1/result');
    });
  });

  test('renders quiz result page correctly', () => {
    // Mock useParams
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ quizId: 'quiz1' }),
      useNavigate: () => jest.fn()
    }));
    
    renderWithRouter('/quizzes/quiz1/result');
    
    // Check if the result title is rendered
    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
    
    // Check if the dictionary name is displayed
    expect(screen.getByText('English Vocabulary')).toBeInTheDocument();
    
    // Check if the score is displayed
    expect(screen.getByText('1/2 (50%)')).toBeInTheDocument();
    
    // Check if the questions and answers are displayed
    expect(screen.getByText('Translate "hello" to Spanish')).toBeInTheDocument();
    expect(screen.getByText('Translate "goodbye" to Spanish')).toBeInTheDocument();
    
    // Check if correct/incorrect answers are displayed
    const correctAnswer = screen.getAllByText(/your answer:/i)[0].nextSibling;
    expect(correctAnswer?.textContent).toBe('hola');
    
    const incorrectAnswer = screen.getAllByText(/your answer:/i)[1].nextSibling;
    expect(incorrectAnswer?.textContent).toBe('gracias');
    
    // Check if the correct answer for the incorrect question is displayed
    expect(screen.getByText('adiós')).toBeInTheDocument();
  });

  test('handles loading state when fetching quiz data', () => {
    // Override the mock for this specific test
    jest.spyOn(require('../../features/quizzes/services/quizApi'), 'useGetUnfinishedQuizzesQuery')
      .mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false
      });
    
    renderWithProviders(<QuizPage />);
    
    // Check if loading spinner is displayed
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('handles error state when fetching quiz data fails', () => {
    // Override the mock for this specific test
    jest.spyOn(require('../../features/quizzes/services/quizApi'), 'useGetUnfinishedQuizzesQuery')
      .mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true
      });
    
    renderWithProviders(<QuizPage />);
    
    // Check if error message is displayed
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  test('navigates back to quizzes page from result page', () => {
    const mockNavigate = jest.fn();
    
    // Override the mock for this specific test
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate);
    
    renderWithRouter('/quizzes/quiz1/result');
    
    // Click the back button
    fireEvent.click(screen.getByText('Back'));
    
    // Check if navigation happens
    expect(mockNavigate).toHaveBeenCalledWith('/quizzes');
  });
});
