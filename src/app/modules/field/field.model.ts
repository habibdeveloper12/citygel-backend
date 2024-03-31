import { Schema, model } from 'mongoose';
import { FieldModel, IField } from './field.interface';

export const fieldSchema = new Schema<IField, FieldModel>(
  {
    name: {
      type: String,
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'textarea', 'select'],
    },
    options: [String],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
fieldSchema.statics.isAddExist = async function (
  name: string
): Promise<IField | null> {
  return await Field.findOne(
    { name: name },
    { name: 1, Subcategory: 1, type: 1, options: 1 }
  );
};
export const Field = model<IField, FieldModel>('Field', fieldSchema);
