import express from 'express';
import { Word } from '../types.ts';
import { readJSON, writeJSON } from '../utils/db.ts';
import { authenticate } from '../utils/authMiddleware.ts';
import { v4 as uuid } from 'uuid';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
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
    definition: data.description || '',
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
