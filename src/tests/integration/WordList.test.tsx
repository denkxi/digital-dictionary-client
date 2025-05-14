import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WordList from '../../features/words/components/WordList';
import { Word, WordClass } from '../../features/words/types/Word';

// Mock words data
const mockWords: Word[] = [
  {
      id: '1',
      writing: 'hello',
      translation: 'tere',
      pronunciation: 'həˈloʊ',
      definition: 'A greeting',
      useExample: 'Hello, how are you?',
      wordClass: WordClass.Noun,
      isStarred: false,
      isLearned: false,
      dictionaryId: 'dict1',
      createdAt: '2023-01-01T00:00:00.000Z',
      createdBy: 'user1'
  },
  {
      id: '2',
      writing: 'goodbye',
      translation: 'head aega',
      pronunciation: 'ˌɡʊdˈbaɪ',
      definition: 'A farewell',
      useExample: 'Goodbye, see you tomorrow.',
      wordClass: WordClass.Noun,
      isStarred: true,
      isLearned: false,
      dictionaryId: 'dict1',
      createdAt: '2023-01-02T00:00:00.000Z',
      createdBy: 'user1'
  },
  {
      id: '3',
      writing: 'run',
      translation: 'jooksma',
      pronunciation: 'rʌn',
      definition: 'To move quickly on foot',
      useExample: 'I run every morning.',
      wordClass: WordClass.Verb,
      isStarred: false,
      isLearned: true,
      dictionaryId: 'dict1',
      createdAt: '2023-01-03T00:00:00.000Z',
      createdBy: 'user1'
  }
];

// Mock the word API
jest.mock('../../features/words/services/wordApi', () => {
  const mockGetWordsByDictionary = jest.fn();
  const mockDeleteWord = jest.fn();
  const mockUpdateWord = jest.fn();

  return {
    useGetWordsByDictionaryQuery: () => ({
      data: {
        items: mockWords,
        totalItems: mockWords.length,
        currentPage: 1,
        totalPages: 1
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn()
    }),
    useDeleteWordMutation: () => [
      mockDeleteWord.mockImplementation((id) => 
        Promise.resolve({ id })
      ),
      { isLoading: false }
    ],
    useUpdateWordMutation: () => [
      mockUpdateWord.mockImplementation(({ id, data }) => 
        Promise.resolve({
          ...mockWords.find(word => word.id === id),
          ...data
        })
      ),
      { isLoading: false }
    ]
  };
});

// Mock the modal components to simplify testing
jest.mock('../../features/words/components/WordModal', () => {
  return function DummyWordModal({ mode, initialData, dictionaryId, onClose }: any) {
    return (
      <div data-testid="word-modal">
        <div>Mode: {mode}</div>
        <div>Word: {initialData ? initialData.writing : 'None'}</div>
        <div>Dictionary ID: {dictionaryId}</div>
        <button onClick={() => onClose()}>Close</button>
        <button 
          onClick={() => {
            if (mode === 'create') {
              // Simulate creating a word
              onClose();
            } else {
              // Simulate updating a word
              onClose();
            }
          }}
        >
          {mode === 'create' ? 'Create' : 'Update'}
        </button>
      </div>
    );
  };
});

jest.mock('../../shared/components/ConfirmDeleteModal', () => {
  return function DummyConfirmDeleteModal({ title, description, onCancel, onConfirm }: any) {
    return (
      <div data-testid="confirm-delete-modal">
        <div>{title}</div>
        <div>{description}</div>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    );
  };
});

// Setup store for testing
const createTestStore = () => 
  configureStore({
    reducer: {}
  });

// Wrap component with necessary providers and router
const renderWithProviders = (ui: React.ReactElement, { dictionaryId = 'dict1' } = {}) => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ui} />
          </Routes>
        </BrowserRouter>
      </Provider>
    ),
    store
  };
};

describe('WordList Integration Tests', () => {
  // Mock useParams to return the dictionary ID
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ dictionaryId: 'dict1' })
    }));
  });

  test('renders the list of words', () => {
    renderWithProviders(<WordList />);
    
    // Check if the component title is rendered
    expect(screen.getByText('Words')).toBeInTheDocument();
    
    // Check if the words are rendered
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Goodbye')).toBeInTheDocument();
    expect(screen.getByText('Run')).toBeInTheDocument();
    
    // Check if the "New Word" button is rendered
    expect(screen.getByText('New Word')).toBeInTheDocument();
  });

  test('shows loading state when fetching words', () => {
    // Override the mock for this specific test
    jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
      .mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false
      });
    
    renderWithProviders(<WordList />);
    
    expect(screen.getByText('Loading words...')).toBeInTheDocument();
  });

  test('shows error state when fetching words fails', () => {
    // Override the mock for this specific test
    jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
      .mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true
      });
    
    renderWithProviders(<WordList />);
    
    expect(screen.getByText('Failed to load words.')).toBeInTheDocument();
  });

  test('shows empty state when no words are found', () => {
    // Override the mock for this specific test
    jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
      .mockReturnValue({
        data: { items: [], totalItems: 0, currentPage: 1, totalPages: 1 },
        isLoading: false,
        isError: false
      });
    
    renderWithProviders(<WordList />);
    
    expect(screen.getByText('No words found.')).toBeInTheDocument();
  });

  test('opens create word modal when clicking "New Word"', () => {
    renderWithProviders(<WordList />);
    
    // Click the "New Word" button
    fireEvent.click(screen.getByText('New Word'));
    
    // Check if the modal is opened in create mode
    expect(screen.getByTestId('word-modal')).toBeInTheDocument();
    expect(screen.getByText('Mode: create')).toBeInTheDocument();
    expect(screen.getByText('Dictionary ID: dict1')).toBeInTheDocument();
  });

  test('opens edit word modal when clicking edit button on a word', async () => {
    renderWithProviders(<WordList />);
    
    // Find and click the edit button on the first word
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    // Check if the modal is opened in edit mode with the correct word
    await waitFor(() => {
      expect(screen.getByTestId('word-modal')).toBeInTheDocument();
      expect(screen.getByText('Mode: edit')).toBeInTheDocument();
      expect(screen.getByText('Word: Hello')).toBeInTheDocument();
    });
  });

  test('toggles starred status when clicking star button', async () => {
    const mockUpdateWord = jest.fn().mockResolvedValue({
      id: '1',
      writing: 'Hello',
      isStarred: true
    });
    
    // Override the mock for this specific test
    jest.spyOn(require('../../features/words/services/wordApi'), 'useUpdateWordMutation')
      .mockReturnValue([
        mockUpdateWord,
        { isLoading: false }
      ]);
    
    renderWithProviders(<WordList />);
    
    // Find and click the star button on the first word
    const starButtons = screen.getAllByRole('button', { name: /star/i });
    fireEvent.click(starButtons[0]);
    
    // Check if the update mutation was called with the correct parameters
    await waitFor(() => {
      expect(mockUpdateWord).toHaveBeenCalledWith({
        id: '1',
        data: { isStarred: true }
      });
    });
  });

  test('toggles learned status when clicking learned button', async () => {
    const mockUpdateWord = jest.fn().mockResolvedValue({
      id: '1',
      writing: 'Hello',
      isLearned: true
    });
    
    // Override the mock for this specific test
    jest.spyOn(require('../../features/words/services/wordApi'), 'useUpdateWordMutation')
      .mockReturnValue([
        mockUpdateWord,
        { isLoading: false }
      ]);
    
    renderWithProviders(<WordList />);
    
    // Find and click the learned button on the first word
    const learnedButtons = screen.getAllByRole('button', { name: /learned/i });
    fireEvent.click(learnedButtons[0]);
    
    // Check if the update mutation was called with the correct parameters
    await waitFor(() => {
      expect(mockUpdateWord).toHaveBeenCalledWith({
        id: '1',
        data: { isLearned: true }
      });
    });
  });

  test('filters words when using search bar', async () => {
    const mockGetWordsByDictionary = jest.fn().mockReturnValue({
      data: {
        items: [mockWords[0]], // Only return "Hello"
        totalItems: 1,
        currentPage: 1,
        totalPages: 1
      },
      isLoading: false,
      isError: false
    });
    
    // Override the mock for this specific test
    jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
      .mockImplementation(mockGetWordsByDictionary);
    
    renderWithProviders(<WordList />);
    
    // Type in the search bar
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Hello' } });
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check if the API was called with the correct search parameter
    expect(mockGetWordsByDictionary).toHaveBeenCalledWith(
      expect.objectContaining({
        dictionaryId: 'dict1',
        search: 'Hello'
      })
    );
  });

  test('filters by word class when selecting a class filter', async () => {
    const mockGetWordsByDictionary = jest.fn().mockReturnValue({
      data: {
        items: [mockWords[2]], // Only return "Run" (VERB)
        totalItems: 1,
        currentPage: 1,
        totalPages: 1
      },
      isLoading: false,
      isError: false
    });
    
    // Override the mock for this specific test
    jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
      .mockImplementation(mockGetWordsByDictionary);
    
    renderWithProviders(<WordList />);
    
    // Click the VERB filter button
    const verbFilterButton = screen.getByRole('button', { name: /verb/i });
    fireEvent.click(verbFilterButton);
    
    // Check if the API was called with the correct word class filter
    expect(mockGetWordsByDictionary).toHaveBeenCalledWith(
      expect.objectContaining({
        dictionaryId: 'dict1',
        wordClass: [WordClass.Verb]
      })
    );
  });

  test('filters starred words when toggling starred filter', async () => {
    const mockGetWordsByDictionary = jest.fn().mockReturnValue({
      data: {
        items: [mockWords[1]], // Only return "Goodbye" (starred)
        totalItems: 1,
        currentPage: 1,
        totalPages: 1
      },
      isLoading: false,
      isError: false
    });
    
    // Override the mock for this specific test
    jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
      .mockImplementation(mockGetWordsByDictionary);
    
    renderWithProviders(<WordList />);
    
    // Click the starred filter button
    const starredFilterButton = screen.getByRole('button', { name: /starred/i });
    fireEvent.click(starredFilterButton);
    
    // Check if the API was called with the correct starred filter
    expect(mockGetWordsByDictionary).toHaveBeenCalledWith(
      expect.objectContaining({
        dictionaryId: 'dict1',
        starred: true
      })
    );
  });

  test('filters learned words when toggling learned filter', async () => {
    const mockGetWordsByDictionary = jest.fn().mockReturnValue({
      data: {
        items: [mockWords[2]], // Only return "Run" (learned)
        totalItems: 1,
        currentPage: 1,
        totalPages: 1
      },
      isLoading: false,
      isError: false
    });
    
        // Override the mock for this specific test
        jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
        .mockImplementation(mockGetWordsByDictionary);
      
      renderWithProviders(<WordList />);
      
      // Click the learned filter button
      const learnedFilterButton = screen.getByRole('button', { name: /learned/i });
      fireEvent.click(learnedFilterButton);
      
      // Check if the API was called with the correct learned filter
      expect(mockGetWordsByDictionary).toHaveBeenCalledWith(
        expect.objectContaining({
          dictionaryId: 'dict1',
          learned: true
        })
      );
    });
  
    test('changes sort order when selecting a different sort option', async () => {
      const mockGetWordsByDictionary = jest.fn().mockReturnValue({
        data: {
          items: [...mockWords].reverse(), // Reverse order
          totalItems: mockWords.length,
          currentPage: 1,
          totalPages: 1
        },
        isLoading: false,
        isError: false
      });
      
      // Override the mock for this specific test
      jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
        .mockImplementation(mockGetWordsByDictionary);
      
      renderWithProviders(<WordList />);
      
      // Open the sort dropdown
      const sortDropdown = screen.getByRole('combobox');
      fireEvent.change(sortDropdown, { target: { value: 'name-desc' } });
      
      // Check if the API was called with the correct sort parameter
      expect(mockGetWordsByDictionary).toHaveBeenCalledWith(
        expect.objectContaining({
          dictionaryId: 'dict1',
          sort: 'name-desc'
        })
      );
    });
  
    test('changes page when clicking pagination controls', async () => {
      // First mock a multi-page response
      jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
        .mockReturnValue({
          data: {
            items: mockWords,
            totalItems: 30, // More items than shown on one page
            currentPage: 1,
            totalPages: 3
          },
          isLoading: false,
          isError: false
        });
      
      renderWithProviders(<WordList />);
      
      // Mock the API call for page 2
      const mockGetWordsByDictionaryPage2 = jest.fn().mockReturnValue({
        data: {
          items: mockWords, // Same words but pretend they're page 2
          totalItems: 30,
          currentPage: 2,
          totalPages: 3
        },
        isLoading: false,
        isError: false
      });
      
      // Override the mock for the next API call
      jest.spyOn(require('../../features/words/services/wordApi'), 'useGetWordsByDictionaryQuery')
        .mockImplementation(mockGetWordsByDictionaryPage2);
      
      // Click the "Next page" button
      const nextPageButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextPageButton);
      
      // Check if the API was called with page 2
      await waitFor(() => {
        expect(mockGetWordsByDictionaryPage2).toHaveBeenCalledWith(
          expect.objectContaining({
            dictionaryId: 'dict1',
            page: 2
          })
        );
      });
    });
  
    test('handles API error when toggling starred status', async () => {
      const errorMessage = 'Failed to update word';
      const mockUpdateWord = jest.fn().mockRejectedValue({ 
        data: { error: errorMessage } 
      });
      
      // Mock window.alert
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      
      // Override the mock for this specific test
      jest.spyOn(require('../../features/words/services/wordApi'), 'useUpdateWordMutation')
        .mockReturnValue([
          mockUpdateWord,
          { isLoading: false }
        ]);
      
      renderWithProviders(<WordList />);
      
      // Find and click the star button on the first word
      const starButtons = screen.getAllByRole('button', { name: /star/i });
      fireEvent.click(starButtons[0]);
      
      // Check if alert was shown with error message
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(errorMessage);
      });
      
      alertMock.mockRestore();
    });
  
    test('closes modal when clicking close button', async () => {
      renderWithProviders(<WordList />);
      
      // Open the create word modal
      fireEvent.click(screen.getByText('New Word'));
      
      // Close the modal
      fireEvent.click(screen.getByText('Close'));
      
      // Check if the modal is closed
      await waitFor(() => {
        expect(screen.queryByTestId('word-modal')).not.toBeInTheDocument();
      });
    });
  });
  
