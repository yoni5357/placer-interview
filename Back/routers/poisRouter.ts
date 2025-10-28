import express from 'express';
import { getPOIs, getFilterOptions } from '../controllers/poisController';

const router = express.Router();

router.get('/filters', getFilterOptions);
router.get('/', getPOIs);

export default router;

