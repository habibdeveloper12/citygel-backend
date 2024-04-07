import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { FieldController } from './field.controller';
const router = express.Router();

router.get('/:name', FieldController.getSingleField);
router.delete(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  FieldController.deleteField
);

router.patch(
  '/:name',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  FieldController.updateField
);
router.get('/', FieldController.getAllFields);
router.post(
  '/',
  // validateRequest(FieldZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  FieldController.createField
);

export const FieldRoutes = router;
