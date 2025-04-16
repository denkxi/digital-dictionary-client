import express from 'express';
import bcrypt from 'bcrypt';
import { readJSON, writeJSON } from '../utils/db.ts';
import { generateAccessToken, generateRefreshToken } from '../utils/authMiddleware.ts';
import { User } from '../types.ts';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SALT_ROUNDS = 10;

// TODO: use env file in real app
const JWT_SECRET = 'super-secret-key'; 

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' }); // todo: dont use numbers as response codes

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

  const token = generateAccessToken(newUser.id);
  const refreshToken = generateRefreshToken(newUser.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

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

  const token = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  res.status(200).json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

// Refresh token
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as { userId: number };

    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // set true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ token: newAccessToken });
  } catch (err) {
    res.sendStatus(403);
  }
});

export default router;
