import express from 'express';
import { authenticate } from '../utils/authMiddleware.ts';
import { Dictionary, UserDictionary } from '../types.ts';
import { readJSON, writeJSON } from '../utils/db.ts';
import { v4 as uuid } from 'uuid';

const router = express.Router();

router.get('/all', async (req, res) => {
  const dictionaries = await readJSON<Dictionary[]>('dictionaries.json');
  res.json(dictionaries);
});

router.get('/', authenticate, async (req, res) => {
  const userId = (req as any).userId;

  const userDictionaries = await readJSON<UserDictionary[]>('userDictionaries.json');
  const dictionaries = await readJSON<Dictionary[]>('dictionaries.json');

  const linkedDictionaries = userDictionaries
    .filter(ud => ud.userId === userId)
    .map(ud => dictionaries.find(d => d.id === ud.dictionaryId))
    .filter((d): d is Dictionary => !!d); // filter out undefined

  res.json(linkedDictionaries);
});

router.post('/', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const data = req.body;

  if (!data.sourceLanguage || !data.targetLanguage) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const dictionaries = await readJSON<Dictionary[]>('dictionaries.json');
  const userDictionaries = await readJSON<UserDictionary[]>('userDictionaries.json');

  const newDict: Dictionary = {
    id: uuid(),
    name: data.name,
    sourceLanguage: data.sourceLanguage,
    targetLanguage: data.targetLanguage,
    description: data.description || '',
    createdBy: userId,
    createdAt: new Date().toISOString()
  };

  dictionaries.push(newDict);
  userDictionaries.push({
    id: uuid(),
    userId,
    dictionaryId: newDict.id
  });

  await writeJSON('dictionaries.json', dictionaries);
  await writeJSON('userDictionaries.json', userDictionaries);

  res.status(201).json(newDict);
});

export default router;
