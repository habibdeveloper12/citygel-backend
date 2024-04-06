import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IField } from './field.interface';
import { FieldService } from './field.service';

const createField = catchAsync(async (req: Request, res: Response) => {
  const { ...field } = req.body;
  console.log(field, 'dffdf');
  const result = await FieldService.createField(field);

  sendResponse<IField>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Field Created successfully !',
    data: result,
  });
});

const getSingleField = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await FieldService.getSingleField(name);

  sendResponse<IField>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Field fetched successfully !',
    data: result,
  });
});

const getAllFields = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, FieldFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await FieldService.getAllFields();

  sendResponse<IField[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fields fetched successfully !',
    // meta: result.meta,
    data: result,
  });
});

const updateField = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;
  const updatedData = req.body;

  const result = await FieldService.updateField(name, updatedData);

  sendResponse<IField>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Field updated successfully !',
    data: result,
  });
});
const deleteField = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await FieldService.deleteField(name);

  sendResponse<IField>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Field deleted successfully !',
    data: result,
  });
});

export const FieldController = {
  getSingleField,
  getAllFields,
  updateField,
  deleteField,
  createField,
};
