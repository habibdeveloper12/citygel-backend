import { Schema, model } from 'mongoose';
import { CountryModel, ICountry } from './country.interface';


export const countrySchema = new Schema<ICountry, CountryModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    countryCode:{
      type:String,
      unique: true,  trim: true,
    },
    city: [
      String
    ],  
     state:[ {
      type: Schema.Types.ObjectId,
      ref: 'State',
    }],
   
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
countrySchema.statics.isAddExist = async function (
  name: string
): Promise<ICountry | null> {
  return await Country.findOne({ name: name }, { name: 1, city: 1,state:1 });
};
export const Country = model<ICountry, CountryModel>('Country', countrySchema);
