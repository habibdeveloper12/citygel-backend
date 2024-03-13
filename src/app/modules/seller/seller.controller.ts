import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ISeller } from './seller.interface';
import { SellerService } from './seller.service';

const createSeller = catchAsync(async (req: Request, res: Response) => {
  const { ...seller } = req.body;
  const result = await SellerService.createSeller(seller);
  console.log(seller, 'dffdf');
  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller Created successfully !',
    data: result,
  });
});
const loginSeller = catchAsync(async (req: Request, res: Response) => {
  const { ...seller } = req.body;
  const result = await SellerService.createSeller(seller);
  console.log(seller, 'dffdf');
  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller Created successfully !',
    data: result,
  });
});

const getSingleSeller = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SellerService.getSingleSeller(id);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller fetched successfully !',
    data: result,
  });
});

// const getAllSellers = catchAsync(async (req: Request, res: Response) => {
//   const filters = pick(req.query, SellerFilterableFields);
//   const paginationOptions = pick(req.query, paginationFields);

//   const result = await SellerService.getAllSellers(filters, paginationOptions);

//   sendResponse<ISeller[]>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Sellers fetched successfully !',
//     meta: result.meta,
//     data: result.data,
//   });
// });

const updateSeller = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await SellerService.updateSeller(id, updatedData);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller updated successfully !',
    data: result,
  });
});
const deleteSeller = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SellerService.deleteSeller(id);

  sendResponse<ISeller>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Seller deleted successfully !',
    data: result,
  });
});

export const SellerController = {
  getSingleSeller,
  // getAllSellers,
  loginSeller,
  updateSeller,
  deleteSeller,
  createSeller,
};
