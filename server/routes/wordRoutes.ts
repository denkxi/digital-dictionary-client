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
    createdAt: new Date().toISOString()
  };

  words.push(newWord);
  await writeJSON('words.json', words);

  res.status(201).json(newWord);
});

export default router;
