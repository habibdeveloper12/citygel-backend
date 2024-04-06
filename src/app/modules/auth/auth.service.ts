import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { Seller } from '../seller/seller.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { generateCode } from './auth.utils';
import { Validation } from './velidation.model';
const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, code } = payload;
  // creating instance of User
  // const user = new User();
  //  // access to our instance methods
  //   const isUserExist = await user.isUserExist(id);
  console.log(payload);
  const isUserExist = await Seller.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  console.log(email, code);
  const verification = await Validation.findOne({ email, code }).exec();
  if (!verification) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong code you entered');
  }
  const alreadyUser = await Seller.findOne({ email: email });
  if (!alreadyUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please create your account');
  }

  const { email: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};
const googgleLogin = async (payload: {
  email: string;
}): Promise<ILoginUserResponse> => {
  const { email } = payload;
  // creating instance of User
  // const user = new User();
  //  // access to our instance methods
  //   const isUserExist = await user.isUserExist(id);
  console.log(payload);
  const isUserExist = await Seller.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const { email: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};
const sendCode = async (payload: any): Promise<any> => {
  const { email } = payload;
  const code = generateCode();
  const transporter = nodemailer.createTransport({
    service: 'other',
    host: 'smtp.hostinger.com',
    port: 465,
    auth: {
      user: 'test@ctobbd.com',
      pass: 'Habib12345@#',
    },
  });
  try {
    const verification = new Validation({ email, code });
    await verification.save();

    const mailOptions = {
      from: 'test@ctobbd.com',
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
    };

    transporter.sendMail(
      mailOptions,
      (error: any, info: { response: string }) => {
        if (error) {
          console.log(error);
          throw new ApiError(httpStatus.BAD_REQUEST, 'code not sent');
        }
      }
    );
    console.log(transporter);
    return verification;
  } catch (error) {
    console.error('Failed to save verification code:', error);
  }
};
const loginsendCode = async (payload: any): Promise<any> => {
  const { email } = payload;
  const findUser = await Seller.isUserExist(email);
  if (!findUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'this email not found please signup'
    );
  }

  const code = generateCode();
  const transporter = nodemailer.createTransport({
    service: 'other',
    host: 'smtp.hostinger.com',
    port: 465,
    auth: {
      user: 'test@ctobbd.com',
      pass: 'Habib12345@#',
    },
  });
  try {
    const verification = new Validation({ email, code });
    await verification.save();

    const mailOptions = {
      from: 'test@ctobbd.com',
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
    };

    transporter.sendMail(
      mailOptions,
      (error: any, info: { response: string }) => {
        if (error) {
          console.log(error);
          throw new ApiError(httpStatus.BAD_REQUEST, 'code not sent');
        }
      }
    );
    console.log(transporter);
    return verification;
  } catch (error) {
    console.error('Failed to save verification code:', error);
  }
};
const signupsendCode = async (payload: any): Promise<any> => {
  const { email } = payload;
  const findUser = await Seller.isUserExist(email);
  if (findUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'this email is already signup please sign in'
    );
  }

  const code = generateCode();
  const transporter = nodemailer.createTransport({
    service: 'other',
    host: 'smtp.hostinger.com',
    port: 465,
    auth: {
      user: 'test@ctobbd.com',
      pass: 'Habib12345@#',
    },
  });
  try {
    const verification = new Validation({ email, code });
    await verification.save();

    const mailOptions = {
      from: 'test@ctobbd.com',
      to: email,
      subject: 'CityGel Verification Code',
      text: `Here is Citygel  verification code is: ${code}`,
    };

    transporter.sendMail(
      mailOptions,
      (error: any, info: { response: string }) => {
        if (error) {
          console.log(error);
          throw new ApiError(httpStatus.BAD_REQUEST, 'code not sent');
        }
      }
    );
    console.log(transporter);
    return verification;
  } catch (error) {
    console.error('Failed to save verification code:', error);
  }
};
const verifyCode = async (payload: any): Promise<any> => {
  const { email, code } = payload;
  console.log(email, code, 'dfffffffffffffff');
  try {
    const verification = await Validation.findOne({ email, code }).exec();

    if (!verification) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong code you entered');
    }
  } catch (error) {
    console.error('Verification failed:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Verification failed');
  }
};
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  // tumi delete hye gso  kintu tumar refresh token ase
  // checking deleted user's refresh token

  const isUserExist = await Seller.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

// const changePassword = async (
//   user: JwtPayload | null,
//   payload: IChangePassword
// ): Promise<void> => {
//   const { oldPassword, newPassword } = payload;

//   // // checking is user exist
//   // const isUserExist = await User.isUserExist(user?.userId);

//   //alternative way
//   const isUserExist = await User.findOne({ id: user?.userId }).select(
//     '+password'
//   );

//   if (!isUserExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
//   }

//   // checking old password
//   if (
//     isUserExist.password &&
//     !(await User.isPasswordMatched(oldPassword, isUserExist.password))
//   ) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
//   }

//   // // hash password before saving
//   // const newHashedPassword = await bcrypt.hash(
//   //   newPassword,
//   //   Number(config.bycrypt_salt_rounds)
//   // );

//   // const query = { id: user?.userId };
//   // const updatedData = {
//   //   password: newHashedPassword,  //
//   //   needsPasswordChange: false,
//   //   passwordChangedAt: new Date(), //
//   // };

//   // await User.findOneAndUpdate(query, updatedData);
//   // data update
//   isUserExist.password = newPassword;

//   // updating using save()
//   isUserExist.save();
// };

export const AuthService = {
  loginUser,
  verifyCode,
  loginsendCode,
  sendCode,
  refreshToken,
  googgleLogin,
  signupsendCode,
};
