import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import QuizResult from '../../features/quizzes/components/QuizResult';
import { Question, QuestionType } from '../../features/quizzes/types/quizTypes';

// Mock the quiz API
jest.mock('../../features/quizzes/services/quizApi', () => ({
  useGetQuizResultQuery: jest.fn()
}));

// Mock the getQuestionPrompt utility
jest.mock('../../features/quizzes/utils/getQuestionPrompt', () => ({
  getQuestionPrompt: (question: Question) => question.prompt
}));

// Mock useParams and useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ quizId: 'quiz1' }),
  useNavigate: () => jest.fn()
}));

describe('QuizResult Unit Tests', () => {
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

  test('renders quiz result correctly', () => {
    // Setup the mock to return quiz result data
    require('../../features/quizzes/services/quizApi').useGetQuizResultQuery.mockReturnValue({
      data: mockQuizResult,
      isLoading: false,
      isError: false
    });
    
    render(
      <BrowserRouter>
        <QuizResult />
      </BrowserRouter>
    );
    
    // Check if the result title is rendered
    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
    
    // Check if the dictionary name is displayed
    expect(screen.getByText('English Vocabulary')).toBeInTheDocument();
    
    // Check if the score is displayed
    expect(screen.getByText('1/2 (50%)')).toBeInTheDocument();
    
    // Check if the completion date is displayed
    expect(screen.getByText(/jan 1, 2023/i)).toBeInTheDocument();
    
    // Check if the questions are displayed
    expect(screen.getByText('Translate "hello" to Spanish')).toBeInTheDocument();
    expect(screen.getByText('Translate "goodbye" to Spanish')).toBeInTheDocument();
    
    // Check if user answers are displayed
    expect(screen.getAllByText(/your answer:/i)[0].nextSibling?.textContent).toBe('hola');
    expect(screen.getAllByText(/your answer:/i)[1].nextSibling?.textContent).toBe('gracias');
    
    // Check if correct answer for incorrect question is displayed
    expect(screen.getByText(/correct answer:/i).nextSibling?.textContent).toBe('adiós');
    
    // Check if questions are styled correctly based on correctness
    const questions = screen.getAllByRole('article');
    expect(questions[0]).toHaveClass('bg-green-50');
    expect(questions[1]).toHaveClass('bg-red-50');
  });
  
  test('shows loading state when fetching quiz result', () => {
    // Setup the mock to return loading state
    require('../../features/quizzes/services/quizApi').useGetQuizResultQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false
    });
    
    render(
      <BrowserRouter>
        <QuizResult />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Loading quiz result...')).toBeInTheDocument();
  });
  
  test('shows error state when fetching quiz result fails', () => {
    // Setup the mock to return error state
    require('../../features/quizzes/services/quizApi').useGetQuizResultQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true
    });
    
    render(
      <BrowserRouter>
        <QuizResult />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Failed to load result.')).toBeInTheDocument();
  });
  
  test('navigates back to quizzes page when clicking back button', () => {
    const mockNavigate = jest.fn();
    
    // Override the useNavigate mock
    jest.spyOn(require('react-router-dom'), 'useNavigate')
      .mockReturnValue(mockNavigate);
    
    // Setup the mock to return quiz result data
    require('../../features/quizzes/services/quizApi').useGetQuizResultQuery.mockReturnValue({
      data: mockQuizResult,
      isLoading: false,
      isError: false
    });
    
    render(
      <BrowserRouter>
        <QuizResult />
      </BrowserRouter>
    );
    
    // Click the back button
    fireEvent.click(screen.getByText('Back'));
    
    // Check if navigation happens
    expect(mockNavigate).toHaveBeenCalledWith('/quizzes');
  });
});
