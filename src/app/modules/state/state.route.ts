import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { StateController } from './state.controller';
const router = express.Router();

router.get(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  StateController.getSingleState
);
router.delete(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StateController.deleteState
);

router.patch(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  StateController.updateState
);
router.get('/', StateController.getAllStates);
router.post(
  '/',
  // validateRequest(StateZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  StateController.createState
);

export const StateRoutes = router;
