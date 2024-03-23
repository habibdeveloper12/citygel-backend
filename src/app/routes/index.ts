import express from 'express';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AdsRoutes } from '../modules/ads/ads.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { MembershipRoutes } from '../modules/membership/membership.route';
import { SellerRoutes } from '../modules/seller/seller.route';
import { SubcategoryRoutes } from '../modules/subcategory/subcategory.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/users',
    route: SellerRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/subcategory',
    route: SubcategoryRoutes,
  },
  {
    path: '/ads',
    route: AdsRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/membership',
    route: MembershipRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
