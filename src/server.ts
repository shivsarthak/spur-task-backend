import express from 'express';
import authRouter from './routes/authRoutes';
import artworkRouter from './routes/artworkRoutes';
import cors from 'cors';
import { verifyToken } from './controllers/authController';
import path from 'path';
const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());

app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRouter);
app.use('/artwork', verifyToken, artworkRouter);

app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});

