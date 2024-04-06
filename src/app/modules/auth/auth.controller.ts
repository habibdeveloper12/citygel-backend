import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: true,
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: others,
  });
});
const googgleLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.googgleLogin(loginData);
  const { refreshToken, ...others } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: true,
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: others,
  });
});
const sendCode = catchAsync(async (req: Request, res: Response) => {
  const { ...code } = req.body;
  const result = await AuthService.sendCode(code);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Code sent to email!',
    data: result,
  });
});
const loginsendCode = catchAsync(async (req: Request, res: Response) => {
  const { ...code } = req.body;
  const result = await AuthService.loginsendCode(code);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Code sent to email!',
    data: result,
  });
});
const signupsendCode = catchAsync(async (req: Request, res: Response) => {
  const { ...code } = req.body;
  const result = await AuthService.signupsendCode(code);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Code sent to email!',
    data: result,
  });
});
const verifyCode = catchAsync(async (req: Request, res: Response) => {
  const { ...code } = req.body;
  const result = await AuthService.verifyCode(code);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Code is verified',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    // secure: config.env === 'production',
    secure: true,
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

// const changePassword = catchAsync(async (req: Request, res: Response) => {
//   const user = req.user;
//   const { ...passwordData } = req.body;

//   await AuthService.changePassword(user, passwordData);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Password changed successfully !',
//   });
// });

export const AuthController = {
  loginUser,
  sendCode,
  verifyCode,
  refreshToken,
  googgleLogin,
  signupsendCode,
  loginsendCode,
};
