import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ISeller } from './seller.interface';
import { SellerService } from './seller.service';

const createSeller = catchAsync(async (req: Request, res: Response) => {
  const { ...seller } = req.body;
  const result = await SellerService.createSeller(seller);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller Created successfully !',
    data: result,
  });
});

const getSingleSeller = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;
  console.log(email);
  const result = await SellerService.getSingleSeller(email);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller fetched successfully !',
    data: result,
  });
});

const getAllSellers = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, SellerFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await SellerService.getAllSellers();

  sendResponse<ISeller[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sellers fetched successfully !',
    // meta: result.meta,
    data: result,
  });
});

const updateSeller = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;
  const updatedData = req.body;

  const result = await SellerService.updateSeller(email, updatedData);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller updated successfully !',
    data: result,
  });
});
const deleteSeller = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;
  const newOwnerEmail = req.query.newemail as string;
  const result = await SellerService.deleteSeller(email, newOwnerEmail);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller deleted successfully !',
    data: result,
  });
});

export const SellerController = {
  getSingleSeller,
  getAllSellers,
  updateSeller,
  deleteSeller,
  createSeller,
};
