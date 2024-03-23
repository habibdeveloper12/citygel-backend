import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IPayment } from './payment.interface';
import { paymentService } from './payment.service';

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { ...paymentData } = req.body;
  const result = await paymentService.createPayment(paymentData);
  console.log(paymentData, 'dffdf');
  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'payment Created successfully !',
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await paymentService.getSinglePayment(name);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'payment fetched successfully !',
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, paymentFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await paymentService.getAllPayments();

  sendResponse<IPayment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'payments fetched successfully !',
    // meta: result.meta,
    data: result,
  });
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;
  const updatedData = req.body;

  const result = await paymentService.updatePayment(name, updatedData);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'payment updated successfully !',
    data: result,
  });
});
const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await paymentService.deletePayment(name);

  sendResponse<IPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'payment deleted successfully !',
    data: result,
  });
});

export const paymentController = {
  getSinglePayment,
  getAllPayments,
  updatePayment,
  deletePayment,
  createPayment,
};
