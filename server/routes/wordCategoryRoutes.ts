import express from 'express';
import { WordCategory } from '../types.ts';
import { readJSON, writeJSON } from '../utils/db.ts';
import { authenticate } from '../utils/authMiddleware.ts';
import { v4 as uuid } from 'uuid';

const router = express.Router();

// Get all user's word categories
router.get('/', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { search = '', sort = 'name-asc', page = 1, limit = 10 } = req.query;

  const allCategories = await readJSON<WordCategory[]>('categories.json');
  const userCategories = allCategories.filter(c => c.createdBy === userId);

  // Filter by search
  const filtered = userCategories.filter(c =>
    c.name.toLowerCase().includes((search as string).toLowerCase())
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    if (sort === 'name-desc') return b.name.localeCompare(a.name);
    if (sort === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const pageLimit = parseInt(limit as string, 10);
  const start = (pageNum - 1) * pageLimit;
  const paginated = sorted.slice(start, start + pageLimit);
  
  
  res.status(200).json({
    items: paginated,
    totalItems: sorted.length,
    currentPage: pageNum,
    totalPages: Math.ceil(sorted.length / pageLimit),
  });
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
  const data = req.body;

  if (!data.name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const categories = await readJSON<WordCategory[]>("categories.json");

  const category = categories.find(c => c.id === categoryId && c.createdBy === userId);

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  Object.assign(category, data);

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

  res.status(200).json({ success: true });
});

export default router;
