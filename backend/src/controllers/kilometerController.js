import { KilometerEntry } from '../models/KilometerEntry.js';
import { CarBrand } from '../models/CarBrand.js';

export const addKilometers = async (req, res, next) => {
  try {
    const { brandId, kilometers } = req.body;
    if (!brandId || kilometers == null) {
      return res.status(400).json({
        success: false,
        message: 'brandId and kilometers are required',
      });
    }
    const numKm = Number(kilometers);
    if (isNaN(numKm) || numKm < 0) {
      return res.status(400).json({
        success: false,
        message: 'kilometers must be a non-negative number',
      });
    }
    const brand = await CarBrand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    const entry = await KilometerEntry.create({
      user: req.user._id,
      brand: brandId,
      kilometers: numKm,
    });
    const populated = await KilometerEntry.findById(entry._id)
      .populate('brand', 'name')
      .lean();
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

export const getMyEntries = async (req, res, next) => {
  try {
    const entries = await KilometerEntry.find({ user: req.user._id })
      .populate('brand', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: entries });
  } catch (err) {
    next(err);
  }
};

export const getTotalsByBrand = async (req, res, next) => {
  try {
    const totals = await KilometerEntry.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$brand', totalKilometers: { $sum: '$kilometers' } } },
      { $lookup: { from: 'carbrands', localField: '_id', foreignField: '_id', as: 'brand' } },
      { $unwind: '$brand' },
      {
        $project: {
          brandId: '$_id',
          brandName: '$brand.name',
          totalKilometers: 1,
          _id: 0,
        },
      },
    ]);
    res.json({ success: true, data: totals });
  } catch (err) {
    next(err);
  }
};
