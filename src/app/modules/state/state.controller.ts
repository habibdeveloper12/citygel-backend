import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IState } from './state.interface';
import { StateService } from './state.service';

const createState = catchAsync(async (req: Request, res: Response) => {
  const { ...State } = req.body;
  const result = await StateService.createState(State);
  console.log(State, 'dffdf');
  sendResponse<IState>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'State Created successfully !',
    data: result,
  });
});

const getSingleState = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await StateService.getSingleState(name);

  sendResponse<IState>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'State fetched successfully !',
    data: result,
  });
});

const getAllStates = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, StateFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await StateService.getAllStates();

  sendResponse<IState[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'States fetched successfully !',
    // meta: result.meta,
    data: result,
  });
});

const updateState = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;
  const updatedData = req.body;

  const result = await StateService.updateState(name, updatedData);

  sendResponse<IState>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'State updated successfully !',
    data: result,
  });
});
const deleteState = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await StateService.deleteState(name);

  sendResponse<IState>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'State deleted successfully !',
    data: result,
  });
});

export const StateController = {
  getSingleState,
  getAllStates,
  updateState,
  deleteState,
  createState,
};
