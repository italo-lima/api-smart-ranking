import { Schema } from 'mongoose';

export const GameSchema = new Schema(
  {
    category: { type: String },
    players: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    def: { type: Schema.Types.ObjectId, ref: 'Player' },
    result: [{ set: { type: String } }],
  },
  { timestamps: true, collection: 'games' },
);
