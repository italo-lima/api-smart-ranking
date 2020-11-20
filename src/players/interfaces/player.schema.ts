import { Schema } from 'mongoose';

export const PlayerSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    phone: String,
    name: String,
    ranking: String,
    positionRanking: Number,
    urlImagePlayer: String,
  },
  {
    timestamps: true,
    collection: 'players',
  },
);
