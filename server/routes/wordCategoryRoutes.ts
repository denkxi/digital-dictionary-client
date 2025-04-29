import express from 'express';
import { WordCategory } from '../types.ts';
import { readJSON, writeJSON } from '../utils/db.ts';
import { authenticate } from '../utils/authMiddleware.ts';
import { v4 as uuid } from 'uuid';

const router = express.Router();

// Get all user's word categories
router.get('/', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const categories = await readJSON<WordCategory[]>('categories.json');
  res.json(categories.filter(c => c.createdBy === userId));
});

// Create new word category
router.post('/', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name required' });

  const categories = await readJSON<WordCategory[]>('categories.json');

  const newCategory: WordCategory = {
    id: uuid(),
    name,
    description: req.body.description || '',
    createdBy: userId,
    createdAt: new Date().toISOString()
  };

  categories.push(newCategory);
  await writeJSON('categories.json', categories);

  res.status(201).json(newCategory);
});

// Update a category
router.patch("/:categoryId", authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { categoryId } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const categories = await readJSON<WordCategory[]>("categories.json");

  const category = categories.find(c => c.id === categoryId && c.createdBy === userId);

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  category.name = name;
  category.description = description;

  await writeJSON("categories.json", categories);

  res.status(201).json({ message: "Category updated", category });
});

// Delete a category
router.delete("/:categoryId", authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { categoryId } = req.params;

  const categories = await readJSON<WordCategory[]>("categories.json");
  const existing = categories.find(c => c.id === categoryId && c.createdBy === userId);

  if (!existing) {
    return res.status(404).json({ error: "Category not found" });
  }

  const updated = categories.filter(c => c.id !== categoryId);
  await writeJSON("categories.json", updated);

  res.status(200).json({ message: "Category deleted" });
});

export default router;
