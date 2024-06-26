import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { CountryController } from './country.controller';
const router = express.Router();

router.get(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  CountryController.getSingleCountry
);
router.delete(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  CountryController.deleteCountry
);

router.patch(
  '/:name',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  CountryController.updateCountry
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER),
  CountryController.getAllCountrys
);
router.post(
  '/',
  // validateRequest(CountryZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CountryController.createCountry
);
router.post(
  '/add-state:name',
  // validateRequest(CountryZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CountryController.updateState,
);
router.delete(
  '/add-state:name',
  // validateRequest(CountryZodSchema),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CountryController.deleteState,
);

export const CountryRoutes = router;
