import { render, screen, fireEvent } from '@testing-library/react';
import WordItem from '../../features/words/components/WordItem';
import { Word, WordClass } from '../../features/words/types/Word';

describe('WordItem Unit Tests', () => {
  const mockWord: Word = {
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
    createdBy: 'user1',
  };

  const mockOnEdit = jest.fn();
  const mockOnToggleStarred = jest.fn();
  const mockOnToggleLearned = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders word information correctly', () => {
    render(
      <WordItem 
        word={mockWord} 
        onEdit={mockOnEdit} 
        onToggleStarred={mockOnToggleStarred}
        onToggleLearned={mockOnToggleLearned}
      />
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('həˈloʊ')).toBeInTheDocument();
    expect(screen.getByText('A greeting')).toBeInTheDocument();
    expect(screen.getByText('NOUN')).toBeInTheDocument();
  });

  test('calls appropriate handlers when buttons are clicked', () => {
    render(
      <WordItem 
        word={mockWord} 
        onEdit={mockOnEdit} 
        onToggleStarred={mockOnToggleStarred}
        onToggleLearned={mockOnToggleLearned}
      />
    );

    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockWord);

    // Click star button
    const starButton = screen.getByRole('button', { name: /star/i });
    fireEvent.click(starButton);
    expect(mockOnToggleStarred).toHaveBeenCalledWith(mockWord);

    // Click learned button
    const learnedButton = screen.getByRole('button', { name: /learned/i });
    fireEvent.click(learnedButton);
    expect(mockOnToggleLearned).toHaveBeenCalledWith(mockWord);
  });

  test('displays starred and learned status correctly', () => {
    const starredAndLearnedWord = {
      ...mockWord,
      isStarred: true,
      isLearned: true
    };

    render(
      <WordItem 
        word={starredAndLearnedWord} 
        onEdit={mockOnEdit} 
        onToggleStarred={mockOnToggleStarred}
        onToggleLearned={mockOnToggleLearned}
      />
    );

    // Check if the starred and learned indicators are displayed
    const starButton = screen.getByRole('button', { name: /star/i });
    expect(starButton).toHaveClass('text-yellow-500'); // Assuming starred items have this class

    const learnedButton = screen.getByRole('button', { name: /learned/i });
    expect(learnedButton).toHaveClass('text-green-500'); // Assuming learned items have this class
  });
});
