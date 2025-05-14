import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DictionaryModal from '../../features/dictionaries/components/DictionaryModal';
import { Dictionary } from '../../features/dictionaries/types/Dictionary';

// Mock the API hooks
jest.mock('../../features/dictionaries/services/dictionaryApi', () => ({
  useCreateDictionaryMutation: () => [
    jest.fn().mockImplementation((data) => Promise.resolve({ id: '3', ...data })),
    { isLoading: false }
  ],
  useUpdateDictionaryMutation: () => [
    jest.fn().mockImplementation(({ id, data }) => Promise.resolve({ id, ...data })),
    { isLoading: false }
  ]
}));

describe('DictionaryModal Unit Tests', () => {
  const mockDictionary: Dictionary = {
    id: '1',
    name: 'English Vocabulary',
    description: 'Common English words',
    isPublic: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    sourceLanguage: 'English',
    targetLanguage: 'Estonian',
    createdBy: 'user1'
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create mode correctly', () => {
    render(<DictionaryModal mode="create" onClose={mockOnClose} />);

    expect(screen.getByText('Create New Dictionary')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/source language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/public/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('renders edit mode correctly with dictionary data', () => {
    render(
      <DictionaryModal 
        mode="edit" 
        initialData={mockDictionary} 
        onClose={mockOnClose} 
      />
    );

    expect(screen.getByText('Edit Dictionary')).toBeInTheDocument();
    
    // Check if form is pre-filled with dictionary data
    expect(screen.getByLabelText(/name/i)).toHaveValue('English Vocabulary');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Common English words');
    expect(screen.getByLabelText(/source language/i)).toHaveValue('English');
    expect(screen.getByLabelText(/target language/i)).toHaveValue('Estonian');
    expect(screen.getByLabelText(/public/i)).toBeChecked();
    
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<DictionaryModal mode="create" onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('shows validation errors when submitting empty form', async () => {
    render(<DictionaryModal mode="create" onClose={mockOnClose} />);

    // Clear the form fields if they have default values
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    // Submit the form
    const createButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  test('submits form with correct data in create mode', async () => {
    const createDictionaryMock = jest.fn().mockResolvedValue({ id: '3', name: 'New Dictionary' });
    
    // Override the mock for this specific test
    jest.spyOn(require('../../features/dictionaries/services/dictionaryApi'), 'useCreateDictionaryMutation')
      .mockReturnValue([
        createDictionaryMock,
        { isLoading: false }
      ]);

    render(<DictionaryModal mode="create" onClose={mockOnClose} />);

    // Fill the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Dictionary' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test description' } });
    fireEvent.change(screen.getByLabelText(/source language/i), { target: { value: 'English' } });
    fireEvent.change(screen.getByLabelText(/target language/i), { target: { value: 'French' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(createDictionaryMock).toHaveBeenCalledWith({
        name: 'New Dictionary',
        description: 'Test description',
        sourceLanguage: 'English',
        targetLanguage: 'French',
        isPublic: true // Default value
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('submits form with correct data in edit mode', async () => {
    const updateDictionaryMock = jest.fn().mockResolvedValue({ 
      id: '1', 
      name: 'Updated Dictionary' 
    });
    
    // Override the mock for this specific test
    jest.spyOn(require('../../features/dictionaries/services/dictionaryApi'), 'useUpdateDictionaryMutation')
      .mockReturnValue([
        updateDictionaryMock,
        { isLoading: false }
      ]);

    render(
      <DictionaryModal 
        mode="edit" 
        initialData={mockDictionary} 
        onClose={mockOnClose} 
      />
    );

    // Update the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Updated Dictionary' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Updated description' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(updateDictionaryMock).toHaveBeenCalledWith({
        id: '1',
        data: {
          name: 'Updated Dictionary',
          description: 'Updated description',
          sourceLanguage: 'English',
          targetLanguage: 'Estonian',
          isPublic: true
        }
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('handles form submission errors', async () => {
    const errorMessage = 'Something went wrong';
    const createDictionaryMock = jest.fn().mockRejectedValue({ 
      data: { error: errorMessage } 
    });
    
    // Mock console.error to prevent test output noise
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Override the mock for this specific test
    jest.spyOn(require('../../features/dictionaries/services/dictionaryApi'), 'useCreateDictionaryMutation')
      .mockReturnValue([
        createDictionaryMock,
        { isLoading: false }
      ]);

    render(<DictionaryModal mode="create" onClose={mockOnClose} />);

    // Fill the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Dictionary' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(createDictionaryMock).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled(); // Modal should stay open on error
    });

    consoleErrorSpy.mockRestore();
  });
});
