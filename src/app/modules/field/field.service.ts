/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { Subcategory } from '../subcategory/subcategory.model';
import { IField } from './field.interface';
import { Field } from './field.model';

const getAllFields = async (): Promise<IField[]> => {
  const allField = Field.find({}).populate('subcategory');
  return allField;
};
const createField = async (field: IField): Promise<any | null> => {
  try {
    const { type, subcategory, options, ...data } = field;
    const subcategoryId = await Subcategory.findOne({ name: subcategory });
    if (!subcategoryId) {
      throw new Error('Subcategory not found');
    }

    const alreadyField = await Field.findOne({
      name: data.name,
      subcategory: subcategoryId._id,
    });
    if (alreadyField) {
      throw new ApiError(500, 'This field already exists');
    }

    switch (type) {
      case 'select':
        {
          const newField = await Field.create({
            name: data.name.toLowerCase(),
            subcategory: subcategoryId._id,
            type: type,
            label: data.label,

            options: options,
          });

          // Update the associated subcategory with the new field's _id

          const updatedThereSubcategory = await Subcategory.findOneAndUpdate(
            { name: subcategory },
            { $push: { fields: newField._id } }, // Use $each to push multiple values
            { new: true }
          );
          if (!updatedThereSubcategory) {
            throw new Error('Subcategory not found');
          }
        }
        break;
      case 'number':
        {
          const createNumber = await Promise.all(
            data.number.map(async element => {
              const newField = await Field.create({
                name: element.name.toLowerCase(),
                subcategory: subcategoryId._id,
                type: type,
                label: element.label,
                parameter: element.parameter,
                options: options,
              });
              return newField;
            })
          );
          // Update the associated subcategory with the new field's _id
          const fieldNumberIds = createNumber.map(
            (field: { _id: any }) => field._id
          );
          const updatedThereSubcategory = await Subcategory.findOneAndUpdate(
            { name: subcategory },
            { $push: { fields: { $each: fieldNumberIds } } }, // Use $each to push multiple values
            { new: true }
          );
          if (!updatedThereSubcategory) {
            throw new Error('Subcategory not found');
          }
        }
        break;
      case 'textarea':
        const createData = await Promise.all(
          data.textarea.map(async element => {
            const newField = await Field.create({
              name: element.name.toLowerCase(),
              subcategory: subcategoryId._id,
              type: type,
              label: element.label,
              parameter: element.parameter,
              options: options,
            });
            return newField;
          })
        );
        // Update the associated subcategory with the new field's _id
        const fieldIds = createData.map((field: { _id: any }) => field._id);
        const updatedSubcategory = await Subcategory.findOneAndUpdate(
          { name: subcategory },
          { $push: { fields: { $each: fieldIds } } }, // Use $each to push multiple values
          { new: true }
        );
        if (!updatedSubcategory) {
          throw new Error('Subcategory not found');
        }

        break;
      default: {
        // Create field for type 'text'
        const createData = await Promise.all(
          data.text.map(async element => {
            const newField = await Field.create({
              name: element.name.toLowerCase(),
              subcategory: subcategoryId._id,
              type: type,
              label: element.label,
              parameter: element.parameter,
              options: options,
            });
            return newField;
          })
        );
        // Update the associated subcategory with the new field's _id
        const fieldIds = createData.map((field: { _id: any }) => field._id);
        const updatedSubcategory = await Subcategory.findOneAndUpdate(
          { name: subcategory },
          { $push: { fields: { $each: fieldIds } } }, // Use $each to push multiple values
          { new: true }
        );
        if (!updatedSubcategory) {
          throw new Error('Subcategory not found');
        }
        return createData;
      }
    }
  } catch (error) {
    // Rollback the transaction in case of error

    console.error('Error creating field:', error);
    throw new Error(`Error creating field: ${error}`);
  } finally {
    // End the session
  }
};

const getSingleField = async (name: string): Promise<IField | null> => {
  const result = await Field.findOne({ name: name });
  return result;
};

const updateField = async (
  name: string,
  payload: Partial<IField>
): Promise<IField | null> => {
  const isExist = await Field.findOne({ name: name });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Field not found !');
  }

  const { ...fieldData } = payload;

  const updatedFieldData: Partial<IField> = { ...fieldData };
  const { subcategory } = payload;
  const findSubcategory = await Subcategory.findOne({ name: subcategory });
  // if (name && Object.keys(name).length > 0) {
  //   Object.keys(name).forEach(key => {
  //     const nameKey = `name.${key}` as keyof Partial<IField>; // `name.fisrtName`
  //     (updatedFieldData as any)[nameKey] = name[key as keyof typeof name];
  //   });
  // }
  // if (guardian && Object.keys(guardian).length > 0) {
  //   Object.keys(guardian).forEach(key => {
  //     const guardianKey = `guardian.${key}` as keyof Partial<IField>; // `guardian.fisrtguardian`
  //     (updatedFieldData as any)[guardianKey] =
  //       guardian[key as keyof typeof guardian];
  //   });
  // }
  // if (localGuardian && Object.keys(localGuardian).length > 0) {
  //   Object.keys(localGuardian).forEach(key => {
  //     const localGuradianKey = `localGuardian.${key}` as keyof Partial<IField>; // `localGuardian.fisrtName`
  //     (updatedFieldData as any)[localGuradianKey] =
  //       localGuardian[key as keyof typeof localGuardian];
  //   });
  // }
  updatedFieldData.subcategory = findSubcategory?._id as any;
  const result = await Field.findOneAndUpdate({ name }, updatedFieldData, {
    new: true,
  });
  return result;
};

const deleteField = async (name: string): Promise<IField | null> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the subcategory to be deleted
    const fieldData = await Field.findOne({ name: name });

    if (!fieldData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'fieldData not found!');
    }

    // Find the category containing the subcategory
    const subcategoryData = await Subcategory.findOneAndUpdate(
      { _id: fieldData.subcategory }, // Filter for categories containing the subcategory
      { $pull: { fields: fieldData._id } }, // Remove the subcategory from the category
      { session }
    );

    if (!subcategoryData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found!');
    }

    // Delete the subcategory
    await fieldData.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    return fieldData;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const FieldService = {
  getAllFields,
  createField,
  getSingleField,
  updateField,
  deleteField,
};
