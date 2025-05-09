import express from 'express';
import { Word } from '../types.ts';
import { readJSON, writeJSON } from '../utils/db.ts';
import { authenticate } from '../utils/authMiddleware.ts';
import { v4 as uuid } from 'uuid';

const router = express.Router();

// Get user's words by dictionary
router.get('/', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const {
    dictionaryId,
    search = '',
    sort = 'name-asc',
    wordClass,
    starred,
    learned,
    page = 1,
    limit = 10,
  } = req.query;

  if (!dictionaryId) {
    return res.status(400).json({ error: 'Missing dictionaryId' });
  }

  const allWords = await readJSON<Word[]>('words.json');
  let words = allWords.filter(
    w => w.dictionaryId === dictionaryId && w.createdBy === userId
  );

  // Search
  if (search) {
    const searchText = (search as string).toLowerCase();
    words = words.filter(w =>
      [w.writing, w.translation, w.pronunciation, w.definition, w.useExample]
        .filter(Boolean) // keep fields that are not undefined
        .some(field => field!.toLowerCase().includes(searchText)) // check if searchText is in any field
    );
  }

  // Word Class Filter (multi)
  if (wordClass) {
    const classes = Array.isArray(wordClass) ? wordClass : [wordClass];
    words = words.filter(w => w.wordClass && classes.includes(w.wordClass));
  }

  // Starred Filter
  if (starred === 'true') {
    words = words.filter(w => w.isStarred);
  }

  // Learned Filter
  if (learned === 'true') {
    words = words.filter(w => w.isLearned);
  }

  // Sorting
  words = [...words].sort((a, b) => {
    if (sort === 'name-asc') return a.writing.localeCompare(b.writing);
    if (sort === 'name-desc') return b.writing.localeCompare(a.writing);
    if (sort === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const start = (pageNum - 1) * pageSize;
  const paginated = words.slice(start, start + pageSize);

  res.json({
    items: paginated,
    totalItems: words.length,
    currentPage: pageNum,
    totalPages: Math.ceil(words.length / pageSize),
  });
});

// GET /api/words/by-ids?ids=a,b,c
router.get('/by-ids', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const idsParam = req.query.ids;

  if (!idsParam || typeof idsParam !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid ids' });
  }

  const ids = idsParam.split(',').map(id => id.trim());

  const allWords = await readJSON<Word[]>('words.json');
  const matched = allWords.filter(w => ids.includes(w.id) && w.createdBy === userId);

  res.json(matched);
});


// Get user's all words by dictionary
router.get('/all', authenticate, async (req, res) => {
  const dictionaryId = req.query.dictionaryId;
  if (!dictionaryId) {
    return res.status(400).json({ error: 'Missing dictionaryId' });
  }
  const words = await readJSON<Word[]>('words.json');
  res.json(words.filter(w => w.dictionaryId === dictionaryId));
});

router.post('/', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const data = req.body;
  if (!data.writing || !data.translation || !data.dictionaryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const words = await readJSON<Word[]>('words.json');
  const newWord: Word = {
    id: uuid(),
    writing: data.writing,
    translation: data.translation,
    pronunciation: data.pronunciation || '',
    definition: data.definition || '',
    useExample: data.useExample || '',
    wordClass: data.wordClass || undefined,
    isStarred: data.isMarked ?? false,
    isLearned: false,
    dictionaryId: data.dictionaryId,
    categoryId: data.categoryId || undefined,
    createdBy: userId,
    createdAt: new Date().toISOString()
  };

  words.push(newWord);
  await writeJSON('words.json', words);

  res.status(201).json(newWord);
});

router.patch('/:id', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const data = req.body;

  const words = await readJSON<Word[]>('words.json');
  const word = words.find(w => w.id === id);

  if (!word) {
    return res.status(404).json({ error: 'Word not found' });
  }

  if (word.createdBy !== userId) {
    return res.status(403).json({ error: 'Unauthorized to edit this word' });
  }

  Object.assign(word, data, { updatedAt: new Date().toISOString() });

  await writeJSON('words.json', words);

  res.status(201).json({ message: 'Word updated', word });
});

router.delete('/:id', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;

  const words = await readJSON<Word[]>('words.json');
  const word = words.find(w => w.id === id);

  if (!word) {
    return res.status(404).json({ error: 'Word not found' });
  }

  if (word.createdBy !== userId) {
    return res.status(403).json({ error: 'Unauthorized to delete this word' });
  }

  const updatedWords = words.filter(w => w.id !== id);

  await writeJSON('words.json', updatedWords);

  res.status(200).json({ success: true });
});


export default router;
