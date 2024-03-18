import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  PaginationFields,
  paginationFields,
} from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { adsFilterableFields } from './ads.constant';
import { AdsFilterableFields, IAds } from './ads.interface';
import { AdsService } from './ads.service';

const createAds = catchAsync(async (req: Request, res: Response) => {
  const { email, ...ads } = req.body;
  const result = await AdsService.createAds(email, ads);
  console.log(ads, 'dffdf');
  sendResponse<IAds>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ads Created successfully !',
    data: result,
  });
});

const getSingleAds = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AdsService.getSingleAds(id);

  sendResponse<IAds>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ads fetched successfully !',
    data: result,
  });
});

const getAllAds = catchAsync(async (req: Request, res: Response) => {
  const filters: AdsFilterableFields = pick(req.query, adsFilterableFields);
  const paginationOptions: PaginationFields = pick(req.query, paginationFields);

  const result = await AdsService.getAllAds(filters, paginationOptions);

  sendResponse<IAds[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ads fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const updateAds = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await AdsService.updateAds(id, updatedData);

  sendResponse<IAds>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ads updated successfully !',
    data: result,
  });
});
const deleteAds = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { email } = req.body;
  const result = await AdsService.deleteAds(email, id);

  sendResponse<IAds | void>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ads deleted successfully !',
    data: result,
  });
});

export const AdsController = {
  getSingleAds,
  getAllAds,
  updateAds,
  deleteAds,
  createAds,
};
