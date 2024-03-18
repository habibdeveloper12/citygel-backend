import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { CategoryController } from './category.controller';
const router = express.Router();

router.get(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  CategoryController.getSingleCategory
);
router.delete(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  CategoryController.deleteCategory
);

router.patch(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  CategoryController.updateCategory
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  CategoryController.getAllCategorys
);
router.post(
  '/',
  // validateRequest(CategoryZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CategoryController.createCategory
);

export const CategoryRoutes = router;
