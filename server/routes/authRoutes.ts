import express from 'express';
import bcrypt from 'bcrypt';
import { readJSON, writeJSON } from '../utils/db.ts';
import { generateToken } from '../utils/authMiddleware.ts';
import { User } from '../types.ts';

const router = express.Router();
const SALT_ROUNDS = 10;

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });

  const users = await readJSON<User[]>('users.json');
  if (users.find(u => u.email === email))
    return res.status(409).json({ error: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser: User = {
    id: (users.at(-1)?.id ?? 0) + 1,
    name,
    email,
    passwordHash
  };

  users.push(newUser);
  await writeJSON('users.json', users);

  const token = generateToken(newUser.id);
  res.status(201).json({ user: { id: newUser.id, name, email }, token });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const users = await readJSON<User[]>('users.json');
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Invalid password' });

  const token = generateToken(user.id);
  res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

export default router;
