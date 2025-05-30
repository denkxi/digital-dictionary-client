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

router.patch('/:id', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const data = req.body;

  const dictionaries = await readJSON<Dictionary[]>('dictionaries.json');

  const dict = dictionaries.find(d => d.id === id);
  if (!dict) {
    return res.status(404).json({ error: 'Dictionary not found' });
  }

  if (dict.createdBy !== userId) {
    return res.status(403).json({ error: 'Unauthorized to edit this dictionary' });
  }

  Object.assign(dict, data, { updatedAt: new Date().toISOString() });

  await writeJSON('dictionaries.json', dictionaries);

  res.status(201).json({ message: 'Dictionary updated', dictionary: dict });
});


// Delete original dictionary and all connected userDictionaries as well (for now)
router.delete('/:id', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;

  const dictionaries = await readJSON<Dictionary[]>('dictionaries.json');
  const userDictionaries = await readJSON<UserDictionary[]>('userDictionaries.json');

  const dict = dictionaries.find(d => d.id === id);
  if (!dict) {
    return res.status(404).json({ error: 'Dictionary not found' });
  }

  if (dict.createdBy !== userId) {
    return res.status(403).json({ error: 'Unauthorized to delete this dictionary' });
  }

  const updatedDictionaries = dictionaries.filter(d => d.id !== id);
  const updatedUserDictionaries = userDictionaries.filter(ud => ud.dictionaryId !== id);

  await writeJSON('dictionaries.json', updatedDictionaries);
  await writeJSON('userDictionaries.json', updatedUserDictionaries);

  res.status(200).json({ success: true });
});


export default router;
