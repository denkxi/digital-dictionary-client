import express from 'express';
import { Word } from '../types.ts';
import { readJSON, writeJSON } from '../utils/db.ts';
import { authenticate } from '../utils/authMiddleware.ts';

const router = express.Router();

router.get('/:dictionaryId', authenticate, async (req, res) => {
  const dictionaryId = Number(req.params.dictionaryId);
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
    id: (words.at(-1)?.id ?? 0) + 1,
    writing: data.writing,
    translation: data.translation,
    pronunciation: data.pronunciation || '',
    description: data.description || '',
    wordClass: data.wordClass || undefined,
    isStarred: data.isMarked ?? false,
    isLearned: false,
    dictionaryId: data.dictionaryId,
    categoryId: data.categoryId || undefined
  };

  words.push(newWord);
  await writeJSON('words.json', words);

  res.status(201).json(newWord);
});

export default router;
