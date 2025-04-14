import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.resolve('data');

export async function readJSON<T>(filename: string): Promise<T> {
  const fullPath = path.join(dataDir, filename);
  const text = await fs.readFile(fullPath, 'utf-8');
  return JSON.parse(text);
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const fullPath = path.join(dataDir, filename);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
}
