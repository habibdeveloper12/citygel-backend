import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { SellerController } from './seller.controller';
const router = express.Router();

router.get(
  '/:email',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  SellerController.getSingleSeller
);
router.delete(
  '/:email',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.SELLER),
  SellerController.deleteSeller
);

router.patch(
  '/:email',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  SellerController.updateSeller
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  SellerController.getAllSellers
);
router.post(
  '/create-user',
  // validateRequest(SellerZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  SellerController.createSeller
);

export const SellerRoutes = router;
