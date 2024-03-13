import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { SellerController } from './seller.controller';
const router = express.Router();

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SellerController.getSingleSeller
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SellerController.deleteSeller
);

// router.patch(
//   '/:id',
//   validateRequest(SellerValidaion.updateSellerZodSchema),
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   SellerController.updateSeller
// );
// router.get(
//   '/',
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   SellerController.getAllSellers
// );
router.post(
  '/create-user',
  // validateRequest(SellerZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SellerController.createSeller
);
router.post(
  '/login',
  // validateRequest(SellerZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SellerController.loginSeller
);

export const SellerRoutes = router;
