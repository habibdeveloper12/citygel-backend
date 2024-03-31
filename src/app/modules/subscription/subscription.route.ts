import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { MembershipController } from './subscription.controller';
const router = express.Router();

router.get(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  MembershipController.getSingleMembership
);
router.delete(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  MembershipController.deleteMembership
);

router.patch(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  MembershipController.updateMembership
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  MembershipController.getAllMemberships
);
router.post(
  '/',
  // validateRequest(MembershipZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  MembershipController.createMembership
);

export const MembershipRoutes = router;
