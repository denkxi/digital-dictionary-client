import { render, screen, fireEvent } from '@testing-library/react';
import WordSearchBar from '../../features/words/components/WordSearchBar';
import { WordClass } from '../../features/words/types/Word';

describe('WordSearchBar Unit Tests', () => {
  const defaultProps = {
    searchValue: '',
    onSearchChange: jest.fn(),
    sortValue: 'name-asc',
    onSortChange: jest.fn(),
    sortOptions: [
      { value: 'name-asc', label: 'Name A–Z' },
      { value: 'name-desc', label: 'Name Z–A' },
      { value: 'date-desc', label: 'Newest First' },
      { value: 'date-asc', label: 'Oldest First' },
    ],
    selectedClasses: [],
    onToggleClass: jest.fn(),
    showStarred: false,
    onToggleStarred: jest.fn(),
    showLearned: false,
    onToggleLearned: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search bar with all controls', () => {
    render(<WordSearchBar {...defaultProps} />);

    // Check if search input is rendered
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();

    // Check if sort dropdown is rendered
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Name A–Z')).toBeInTheDocument();

    // Check if word class filters are rendered
    Object.values(WordClass).forEach(wordClass => {
      expect(screen.getByRole('button', { name: new RegExp(wordClass, 'i') })).toBeInTheDocument();
    });

    // Check if starred and learned filters are rendered
    expect(screen.getByRole('button', { name: /starred/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /learned/i })).toBeInTheDocument();
  });

  test('calls handlers when controls are interacted with', () => {
    render(<WordSearchBar {...defaultProps} />);

    // Test search input
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test');

    // Test sort dropdown
    const sortDropdown = screen.getByRole('combobox');
    fireEvent.change(sortDropdown, { target: { value: 'name-desc' } });
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('name-desc');

    // Test word class filter
    const nounButton = screen.getByRole('button', { name: /noun/i });
    fireEvent.click(nounButton);
    expect(defaultProps.onToggleClass).toHaveBeenCalledWith(WordClass.Noun);

    // Test starred filter
    const starredButton = screen.getByRole('button', { name: /starred/i });
    fireEvent.click(starredButton);
    expect(defaultProps.onToggleStarred).toHaveBeenCalled();

    // Test learned filter
    const learnedButton = screen.getByRole('button', { name: /learned/i });
    fireEvent.click(learnedButton);
    expect(defaultProps.onToggleLearned).toHaveBeenCalled();
  });

  test('displays active filters correctly', () => {
    const activeFiltersProps = {
      ...defaultProps,
      selectedClasses: [WordClass.Noun, WordClass.Verb],
      showStarred: true,
      showLearned: true,
    };

    render(<WordSearchBar {...activeFiltersProps} />);

    // Check if the active word class filters have the active class
    const nounButton = screen.getByRole('button', { name: /noun/i });
    const verbButton = screen.getByRole('button', { name: /verb/i });
    const adjButton = screen.getByRole('button', { name: /adjective/i });

    expect(nounButton).toHaveClass('bg-primary-2'); // Assuming active filters have this class
    expect(verbButton).toHaveClass('bg-primary-2');
    expect(adjButton).not.toHaveClass('bg-primary-2');

    // Check if starred and learned filters are active
    const starredButton = screen.getByRole('button', { name: /starred/i });
    const learnedButton = screen.getByRole('button', { name: /learned/i });

    expect(starredButton).toHaveClass('bg-primary-2');
    expect(learnedButton).toHaveClass('bg-primary-2');
  });
});
