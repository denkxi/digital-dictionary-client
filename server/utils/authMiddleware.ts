import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// TODO: use env file in real app
const SECRET = 'super-secret-key'; 

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, SECRET, { expiresIn: '1h' });
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, SECRET) as { userId: number };
    (req as any).userId = payload.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
