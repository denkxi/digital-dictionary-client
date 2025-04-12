// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database
const db = {
  users: {
    'user-1': {
      id: 'user-1',
      username: 'testuser',
      email: 'test@example.com'
    }
  },
  words: [
    {
      id: uuidv4(),
      userId: 'user-1',
      word: 'apple',
      translation: 'õun',
      categoryId: 'food',
      examples: ['I ate an apple', 'The apple is red'],
      notes: 'Common fruit',
      createdAt: new Date().toISOString(),
      learned: false
    },
    {
      id: uuidv4(),
      userId: 'user-1',
      word: 'book',
      translation: 'raamat',
      categoryId: 'education',
      examples: ['I read a book', 'The book is on the table'],
      notes: '',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      learned: true
    },
    {
      id: uuidv4(),
      userId: 'user-1',
      word: 'car',
      translation: 'auto',
      categoryId: 'transport',
      examples: ['I drive a car', 'The car is red'],
      notes: 'Vehicle',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      learned: false
    }
  ],
  categories: [
    {
      id: 'food',
      userId: 'user-1',
      name: 'Food',
      description: 'Food and drinks vocabulary'
    },
    {
      id: 'education',
      userId: 'user-1',
      name: 'Education',
      description: 'School and education related words'
    },
    {
      id: 'transport',
      userId: 'user-1',
      name: 'Transport',
      description: 'Words related to transportation'
    }
  ]
};

// API Routes

// Get user's words
app.get('/api/users/:userId/words', (req, res) => {
  const { userId } = req.params;
  const userWords = db.words.filter(word => word.userId === userId);
  
  console.log(`GET /api/users/${userId}/words - Returned ${userWords.length} words`);
  res.json(userWords);
});

// Add new word
app.post('/api/users/:userId/words', (req, res) => {
  const { userId } = req.params;
  const newWord = {
    id: uuidv4(),
    userId,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  db.words.push(newWord);
  console.log(`POST /api/users/${userId}/words - Added new word: ${newWord.word}`);
  res.status(201).json(newWord);
});

// Update word
app.patch('/api/users/:userId/words/:wordId', (req, res) => {
  const { userId, wordId } = req.params;
  
  const wordIndex = db.words.findIndex(
    word => word.id === wordId && word.userId === userId
  );
  
  if (wordIndex === -1) {
    console.log(`PATCH /api/users/${userId}/words/${wordId} - Word not found`);
    return res.status(404).json({ error: 'Word not found' });
  }
  
  const updatedWord = {
    ...db.words[wordIndex],
    ...req.body
  };
  
  db.words[wordIndex] = updatedWord;
  console.log(`PATCH /api/users/${userId}/words/${wordId} - Updated word: ${updatedWord.word}`);
  res.json(updatedWord);
});

// Delete word
app.delete('/api/users/:userId/words/:wordId', (req, res) => {
  const { userId, wordId } = req.params;
  
  const initialLength = db.words.length;
  db.words = db.words.filter(
    word => !(word.id === wordId && word.userId === userId)
  );
  
  if (db.words.length === initialLength) {
    console.log(`DELETE /api/users/${userId}/words/${wordId} - Word not found`);
    return res.status(404).json({ error: 'Word not found' });
  }
  
  console.log(`DELETE /api/users/${userId}/words/${wordId} - Word deleted`);
  res.status(204).end();
});

// Get user's categories
app.get('/api/users/:userId/categories', (req, res) => {
  const { userId } = req.params;
  const userCategories = db.categories.filter(category => category.userId === userId);
  
  console.log(`GET /api/users/${userId}/categories - Returned ${userCategories.length} categories`);
  res.json(userCategories);
});

// Add new category
app.post('/api/users/:userId/categories', (req, res) => {
  const { userId } = req.params;
  const newCategory = {
    id: req.body.id || uuidv4(),
    userId,
    ...req.body
  };
  
  db.categories.push(newCategory);
  console.log(`POST /api/users/${userId}/categories - Added new category: ${newCategory.name}`);
  res.status(201).json(newCategory);
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ======================================================
  Digital Dictionary API Server running on port ${PORT}
  ------------------------------------------------------
  Available endpoints:
  GET    /api/users/:userId/words
  POST   /api/users/:userId/words
  PATCH  /api/users/:userId/words/:wordId
  DELETE /api/users/:userId/words/:wordId
  GET    /api/users/:userId/categories
  POST   /api/users/:userId/categories
  ======================================================
  `);
});