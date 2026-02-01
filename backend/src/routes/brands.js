import express from 'express';
import {
  listBrands,
  createBrand,
  getBrand,
  deleteBrand,
} from '../controllers/brandController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router.get('/', listBrands);
router.get('/:id', getBrand);
router.post('/', requireAdmin, createBrand);
router.delete('/:id', requireAdmin, deleteBrand);

export default router;
