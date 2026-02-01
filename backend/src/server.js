import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from './config/db.js';
import { swaggerSpec } from './config/swagger.js';

import authRoutes from './routes/auth.js';
import brandRoutes from './routes/brands.js';
import kilometerRoutes from './routes/kilometers.js';

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/kilometers', kilometerRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Car Brand Tracker API' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
