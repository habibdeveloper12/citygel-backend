import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IMembership } from './membership.interface';
import { MembershipService } from './membership.service';

const createMembership = catchAsync(async (req: Request, res: Response) => {
  const { ...membership } = req.body;
  const result = await MembershipService.createMembership(membership);
  console.log(membership, 'dffdf');
  sendResponse<IMembership>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Membership Created successfully !',
    data: result,
  });
});

const getSingleMembership = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await MembershipService.getSingleMembership(name);

  sendResponse<IMembership>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Membership fetched successfully !',
    data: result,
  });
});

const getAllMemberships = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, MembershipFilterableFields);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await MembershipService.getAllMemberships();

  sendResponse<IMembership[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Memberships fetched successfully !',
    // meta: result.meta,
    data: result,
  });
});

const updateMembership = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;
  const updatedData = req.body;

  const result = await MembershipService.updateMembership(name, updatedData);

  sendResponse<IMembership>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Membership updated successfully !',
    data: result,
  });
});
const deleteMembership = catchAsync(async (req: Request, res: Response) => {
  const name = req.params.name;

  const result = await MembershipService.deleteMembership(name);

  sendResponse<IMembership>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Membership deleted successfully !',
    data: result,
  });
});

export const MembershipController = {
  getSingleMembership,
  getAllMemberships,
  updateMembership,
  deleteMembership,
  createMembership,
};
