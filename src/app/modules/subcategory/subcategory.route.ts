import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { SubcategoryController } from './subcategory.controller';
const router = express.Router();

router.get(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  SubcategoryController.getSingleSubcategory
);
router.delete(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  SubcategoryController.deleteSubcategory
);

router.patch(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  SubcategoryController.updateSubcategory
);
router.get('/', SubcategoryController.getAllSubcategorys);
router.post(
  '/',
  // validateRequest(SubcategoryZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  SubcategoryController.createSubcategory
);

export const SubcategoryRoutes = router;
