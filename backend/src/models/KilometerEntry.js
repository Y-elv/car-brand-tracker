import mongoose from 'mongoose';

const kilometerEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CarBrand',
      required: true,
    },
    kilometers: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

kilometerEntrySchema.index({ user: 1, brand: 1 });

export const KilometerEntry = mongoose.model('KilometerEntry', kilometerEntrySchema);
