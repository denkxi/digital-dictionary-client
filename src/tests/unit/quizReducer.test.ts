import { quizReducer, initialQuizState, QuizState, QuizAction } from '../../features/quizzes/services/quizReducer';

describe('Quiz Reducer Unit Tests', () => {
  test('handles ANSWER action correctly', () => {
    const initialState: QuizState = {
      currentIndex: 0,
      answers: {}
    };
    
    const action: QuizAction = {
      type: 'ANSWER',
      questionId: 'q1',
      answer: 'hola'
    };
    
    const newState = quizReducer(initialState, action);
    
    expect(newState).toEqual({
      currentIndex: 0,
      answers: {
        q1: 'hola'
      }
    });
    
    // Test adding another answer
    const secondAction: QuizAction = {
      type: 'ANSWER',
      questionId: 'q2',
      answer: 'adiós'
    };
    
    const finalState = quizReducer(newState, secondAction);
    
    expect(finalState).toEqual({
      currentIndex: 0,
      answers: {
        q1: 'hola',
        q2: 'adiós'
      }
    });
  });
  
  test('handles NEXT_QUESTION action correctly', () => {
    const initialState: QuizState = {
      currentIndex: 0,
      answers: {
        q1: 'hola'
      }
    };
    
    const action: QuizAction = {
      type: 'NEXT_QUESTION'
    };
    
    const newState = quizReducer(initialState, action);
    
    expect(newState).toEqual({
      currentIndex: 1,
      answers: {
        q1: 'hola'
      }
    });
    
    // Test advancing to next question again
    const finalState = quizReducer(newState, action);
    
    expect(finalState).toEqual({
      currentIndex: 2,
      answers: {
        q1: 'hola'
      }
    });
  });
  
  test('handles RESET action correctly', () => {
    const initialState: QuizState = {
      currentIndex: 2,
      answers: {
        q1: 'hola',
        q2: 'adiós'
      }
    };
    
    const action: QuizAction = {
      type: 'RESET'
    };
    
    const newState = quizReducer(initialState, action);
    
    expect(newState).toEqual(initialQuizState);
  });
  
  test('returns current state for unknown action', () => {
    const initialState: QuizState = {
      currentIndex: 1,
      answers: {
        q1: 'hola'
      }
    };
    
    const action = {
        type: 'UNKNOWN_ACTION'
    } as unknown as QuizAction;
    
    const newState = quizReducer(initialState, action);
    
    // Should return the same state unchanged
    expect(newState).toBe(initialState);
  });});
