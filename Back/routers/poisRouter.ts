import express from 'express';
import { getPOIs, getFilterOptions, autocomplete } from '../controllers/poisController';

const router = express.Router();

router.get('/filters', getFilterOptions);
router.get('/autocomplete', autocomplete);
router.get('/', getPOIs);

export default router;

