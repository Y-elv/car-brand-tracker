import { CarBrand } from '../models/CarBrand.js';

export const listBrands = async (req, res, next) => {
  try {
    const brands = await CarBrand.find().sort({ name: 1 });
    res.json({ success: true, data: brands });
  } catch (err) {
    next(err);
  }
};

export const createBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Brand name is required',
      });
    }
    const existing = await CarBrand.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Brand with this name already exists',
      });
    }
    const brand = await CarBrand.create({ name: name.trim() });
    res.status(201).json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

export const getBrand = async (req, res, next) => {
  try {
    const brand = await CarBrand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    res.json({ success: true, data: brand });
  } catch (err) {
    next(err);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const brand = await CarBrand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    res.json({ success: true, message: 'Brand deleted' });
  } catch (err) {
    next(err);
  }
};
