import express from 'express';
import {
  addKilometers,
  getMyEntries,
  getTotalsByBrand,
} from '../controllers/kilometerController.js';
import { protect } from '../middleware/auth.js';
import { requireUser } from '../middleware/role.js';

const router = express.Router();

router.use(protect);
router.use(requireUser);

router.post('/', addKilometers);
router.get('/totals', getTotalsByBrand);
router.get('/', getMyEntries);

export default router;
