import express from 'express';
import { getPOIs } from '../controllers/poisController';

const router = express.Router();

router.get('/', getPOIs);

export default router;

