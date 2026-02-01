import mongoose from 'mongoose';

const carBrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const CarBrand = mongoose.model('CarBrand', carBrandSchema);
