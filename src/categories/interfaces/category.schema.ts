import { Schema } from 'mongoose';

export const CategorySchema = new Schema(
  {
    category: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    events: [
      {
        name: { type: String },
        opertation: { type: String },
        value: { type: Number },
      },
    ],
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'categories',
  },
);
