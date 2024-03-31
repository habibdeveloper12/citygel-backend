import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import { CountryService } from './country.service';
import { ICountry } from './country.interface';

const createCountry = catchAsync(async (req: Request, res: Response) => {
  const { ...Country } = req.body;
  const result = await CountryService.createCountry(Country);
  console.log(Country, 'dffdf');
  sendResponse<ICountry>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Country Created successfully !',
    data: result,
  });
});

const getSingleCountry = catchAsync(async (req: Request, res: Response) => {
  const cname = req.params.name;
  const name = cname.toLowerCase();
  const result = await CountryService.getSingleCountry(name);

  sendResponse<ICountry>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Country fetched successfully !',
    data: result,
  });
});

const getAllCountrys = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, CountryFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await CountryService.getAllCountrys();

  sendResponse<ICountry[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Countrys fetched successfully !',
    // meta: result.meta,
    data: result,
  });
});

const updateCountry = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;
  const updatedData = req.body;

  const result = await CountryService.updateCountry(name, updatedData);

  sendResponse<ICountry>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Country updated successfully !',
    data: result,
  });
});
const deleteCountry = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await CountryService.deleteCountry(name);

  sendResponse<ICountry>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Country deleted successfully !',
    data: result,
  });
});

export const CountryController = {
  getSingleCountry,
  getAllCountrys,
  updateCountry,
  deleteCountry,
  createCountry,
};
