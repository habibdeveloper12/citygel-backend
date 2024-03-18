import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ICategory } from './category.interface';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { ...Category } = req.body;
  const result = await CategoryService.createCategory(Category);
  console.log(Category, 'dffdf');
  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category Created successfully !',
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const cname = req.params.name;
  const name = cname.toLowerCase();
  const result = await CategoryService.getSingleCategory(name);

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category fetched successfully !',
    data: result,
  });
});

const getAllCategorys = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, CategoryFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await CategoryService.getAllCategorys();

  sendResponse<ICategory[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categorys fetched successfully !',
    // meta: result.meta,
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;
  const updatedData = req.body;

  const result = await CategoryService.updateCategory(name, updatedData);

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully !',
    data: result,
  });
});
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await CategoryService.deleteCategory(name);

  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully !',
    data: result,
  });
});

export const CategoryController = {
  getSingleCategory,
  getAllCategorys,
  updateCategory,
  deleteCategory,
  createCategory,
};
