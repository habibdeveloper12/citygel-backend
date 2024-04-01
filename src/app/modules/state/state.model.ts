import { Schema, model } from 'mongoose';
import { IState, StateModel } from './state.interface';

export const stateSchema = new Schema<IState, StateModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  
    ads: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ads',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
stateSchema.statics.isAddExist = async function (
  name: string
): Promise<IState | null> {
  return await State.findOne({ name: name }, { name: 1, category: 1 });
};
export const State = model<IState, StateModel>(
  'State',
  stateSchema
);
