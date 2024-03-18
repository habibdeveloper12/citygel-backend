import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ISubcategory } from './subcategory.interface';
import { SubcategoryService } from './subcategory.service';

const createSubcategory = catchAsync(async (req: Request, res: Response) => {
  const { ...Subcategory } = req.body;
  const result = await SubcategoryService.createSubcategory(Subcategory);
  console.log(Subcategory, 'dffdf');
  sendResponse<ISubcategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subcategory Created successfully !',
    data: result,
  });
});

const getSingleSubcategory = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await SubcategoryService.getSingleSubcategory(name);

  sendResponse<ISubcategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subcategory fetched successfully !',
    data: result,
  });
});

const getAllSubcategorys = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, SubcategoryFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await SubcategoryService.getAllSubcategorys();

  sendResponse<ISubcategory[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subcategorys fetched successfully !',
    // meta: result.meta,
    data: result,
  });
});

const updateSubcategory = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;
  const updatedData = req.body;

  const result = await SubcategoryService.updateSubcategory(name, updatedData);

  sendResponse<ISubcategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subcategory updated successfully !',
    data: result,
  });
});
const deleteSubcategory = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await SubcategoryService.deleteSubcategory(name);

  sendResponse<ISubcategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subcategory deleted successfully !',
    data: result,
  });
});

export const SubcategoryController = {
  getSingleSubcategory,
  getAllSubcategorys,
  updateSubcategory,
  deleteSubcategory,
  createSubcategory,
};
