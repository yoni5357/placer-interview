import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './models';
import usersRouter from './routers/usersRouter';
import poisRouter from './routers/poisRouter';

const server = express();

// Middlewares
server.use(express.json());
server.use(cors({ origin: 'http://localhost:5173' }));

// Routers
server.use('/api/users', usersRouter);
server.use('/api/pois', poisRouter);

// Start server and connect to database
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`API on :${PORT}`);
  await connectDB();
});

// Error Handler
server.use((err:Error, req:Request, res:Response, next:NextFunction) => {
  console.error('ERROR MW:', err);
  res.status(500).json({ error: 'server error' });
});