import express from 'express';
import cors from 'cors';
import dictionaryRouter from './routes/dictionaryRoutes.ts';
import authRouter from './routes/authRoutes.js';
import wordRouter from './routes/wordRoutes.ts';
import categoryRoutes from './routes/wordCategoryRoutes.ts';
import cookieParser from 'cookie-parser';


const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/dictionaries', dictionaryRouter);
app.use('/api/words', wordRouter);
app.use('/api/word-categories', categoryRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
