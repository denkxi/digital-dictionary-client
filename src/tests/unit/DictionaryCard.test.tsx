import { render, screen, fireEvent } from '@testing-library/react';
import DictionaryCard from '../../features/dictionaries/components/DictionaryCard';
import { Dictionary } from '../../features/dictionaries/types/Dictionary';

describe('DictionaryCard Unit Tests', () => {
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

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dictionary information correctly', () => {
    render(
      <DictionaryCard 
        dictionary={mockDictionary} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('English Vocabulary')).toBeInTheDocument();
    expect(screen.getByText('Common English words')).toBeInTheDocument();
    expect(screen.getByText('English → Estonian')).toBeInTheDocument();
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <DictionaryCard 
        dictionary={mockDictionary} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockDictionary);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <DictionaryCard 
        dictionary={mockDictionary} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockDictionary);
  });

  test('displays private status correctly', () => {
    const privateDictionary = {
      ...mockDictionary,
      isPublic: false
    };

    render(
      <DictionaryCard 
        dictionary={privateDictionary} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  test('formats date correctly', () => {
    render(
      <DictionaryCard 
        dictionary={mockDictionary} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // This assumes you're displaying the date in some format
    // Adjust this based on how you actually format dates in your component
    const dateElement = screen.getByText(/jan 1, 2023/i);
    expect(dateElement).toBeInTheDocument();
  });
});
