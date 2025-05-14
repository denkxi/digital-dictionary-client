import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DictionariesList from '../../features/dictionaries/components/DictionariesList';
import { Dictionary } from '../../features/dictionaries/types/Dictionary';

// Mock dictionaries data
const mockDictionaries: Dictionary[] = [
  {
      id: '1',
      name: 'English Vocabulary',
      description: 'Common English words',
      isPublic: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      sourceLanguage: 'English',
      targetLanguage: 'Estonian',
      createdBy: 'user1'
  },
  {
      id: '2',
      name: 'Spanish Basics',
      description: 'Basic Spanish vocabulary',
      isPublic: false,
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
      sourceLanguage: 'Spanish',
      targetLanguage: 'English',
      createdBy: 'user1'
  }
];

// Mock the dictionary API
jest.mock('../../features/dictionaries/services/dictionaryApi', () => {
  const mockGetUserDictionaries = jest.fn();
  const mockDeleteDictionary = jest.fn();
  const mockCreateDictionary = jest.fn();
  const mockUpdateDictionary = jest.fn();

  return {
    useGetUserDictionariesQuery: () => ({
      data: mockDictionaries,
      isLoading: false,
      isError: false,
      refetch: jest.fn()
    }),
    useDeleteDictionaryMutation: () => [
      mockDeleteDictionary.mockImplementation((id) => 
        Promise.resolve({ id })
      ),
      { isLoading: false }
    ],
    useCreateDictionaryMutation: () => [
      mockCreateDictionary.mockImplementation((newDict) => 
        Promise.resolve({
          id: '3',
          ...newDict,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: 'user1'
        })
      ),
      { isLoading: false }
    ],
    useUpdateDictionaryMutation: () => [
      mockUpdateDictionary.mockImplementation(({ id, data }) => 
        Promise.resolve({
          id,
          ...data,
          updatedAt: new Date().toISOString(),
          userId: 'user1'
        })
      ),
      { isLoading: false }
    ]
  };
});

// Mock the modal components to simplify testing
jest.mock('../../features/dictionaries/components/DictionaryModal', () => {
  return function DummyDictionaryModal({ mode, initialData, onClose }: any) {
    return (
      <div data-testid="dictionary-modal">
        <div>Mode: {mode}</div>
        <div>Dictionary: {initialData ? initialData.name : 'None'}</div>
        <button onClick={() => onClose()}>Close</button>
        <button 
          onClick={() => {
            if (mode === 'create') {
              // Simulate creating a dictionary
              const newDict = {
                name: 'New Dictionary',
                description: 'Created in test',
                isPublic: true
              };
              onClose();
            } else {
              // Simulate updating a dictionary
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

// Wrap component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        {ui}
      </Provider>
    ),
    store
  };
};

describe('DictionariesList Integration Tests', () => {
  test('renders the list of dictionaries', () => {
    renderWithProviders(<DictionariesList />);
    
    // Check if the component title is rendered
    expect(screen.getByText('Your Dictionaries')).toBeInTheDocument();
    
    // Check if the dictionaries are rendered
    expect(screen.getByText('English Vocabulary')).toBeInTheDocument();
    expect(screen.getByText('Spanish Basics')).toBeInTheDocument();
    
    // Check if the "New Dictionary" button is rendered
    expect(screen.getByText('New Dictionary')).toBeInTheDocument();
  });

  test('shows loading state when fetching dictionaries', () => {
    // Override the mock for this specific test
    jest.spyOn(require('../../features/dictionaries/services/dictionaryApi'), 'useGetUserDictionariesQuery')
      .mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false
      });
    
    renderWithProviders(<DictionariesList />);
    
    expect(screen.getByText('Loading dictionaries...')).toBeInTheDocument();
  });

  test('shows error state when fetching dictionaries fails', () => {
    // Override the mock for this specific test
    jest.spyOn(require('../../features/dictionaries/services/dictionaryApi'), 'useGetUserDictionariesQuery')
      .mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true
      });
    
    renderWithProviders(<DictionariesList />);
    
    expect(screen.getByText('Failed to load dictionaries.')).toBeInTheDocument();
  });

  test('opens create dictionary modal when clicking "New Dictionary"', () => {
    renderWithProviders(<DictionariesList />);
    
    // Click the "New Dictionary" button
    fireEvent.click(screen.getByText('New Dictionary'));
    
    // Check if the modal is opened in create mode
    expect(screen.getByTestId('dictionary-modal')).toBeInTheDocument();
    expect(screen.getByText('Mode: create')).toBeInTheDocument();
  });

  test('opens edit dictionary modal when clicking edit button on a dictionary', async () => {
    renderWithProviders(<DictionariesList />);
    
    // Find and click the edit button on the first dictionary
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    
    // Check if the modal is opened in edit mode with the correct dictionary
    await waitFor(() => {
      expect(screen.getByTestId('dictionary-modal')).toBeInTheDocument();
      expect(screen.getByText('Mode: edit')).toBeInTheDocument();
      expect(screen.getByText('Dictionary: English Vocabulary')).toBeInTheDocument();
    });
  });

  test('opens delete confirmation modal when clicking delete button on a dictionary', async () => {
    renderWithProviders(<DictionariesList />);
    
    // Find and click the delete button on the first dictionary
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Check if the confirmation modal is opened
    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-modal')).toBeInTheDocument();
      expect(screen.getByText('Delete Dictionary')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete "English Vocabulary"?')).toBeInTheDocument();
    });
  });

  test('deletes dictionary when confirming deletion', async () => {
    const mockDeleteDictionary = jest.fn().mockResolvedValue({ id: '1' });
    
    // Override the mock for this specific test
    jest.spyOn(require('../../features/dictionaries/services/dictionaryApi'), 'useDeleteDictionaryMutation')
      .mockReturnValue([
        mockDeleteDictionary,
        { isLoading: false }
      ]);
    
    renderWithProviders(<DictionariesList />);
    
    // Find and click the delete button on the first dictionary
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion
    await waitFor(() => {
      fireEvent.click(screen.getByText('Confirm'));
    });
    
    // Check if the delete mutation was called with the correct ID
    expect(mockDeleteDictionary).toHaveBeenCalledWith('1');
  });

  test('closes modal when clicking close button', async () => {
    renderWithProviders(<DictionariesList />);
    
    // Open the create dictionary modal
    fireEvent.click(screen.getByText('New Dictionary'));
    
    // Close the modal
    fireEvent.click(screen.getByText('Close'));
    
    // Check if the modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('dictionary-modal')).not.toBeInTheDocument();
    });
  });
});
