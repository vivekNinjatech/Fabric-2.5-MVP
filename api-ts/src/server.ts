import express from 'express';
import cors from 'cors'; // Import cors middleware
import assetRouter from './routers/assetRouter';
import authRouter from './routers/authRouter';

const app = express();

app.use(cors()); // Enable CORS for all origins
app.use(express.json());

app.use('/api/assets', assetRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
