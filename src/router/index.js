/**
 * specifies how different URLs map to specific components
 * path: The URL path for the route
 * name: A unique identifier for the route
 * component: The component to be rendered when the route is accessed
 * meta: title, authentication requirements, etc.
 */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    name: "Home",
    path: "/",
    component: () => import("@/views/Home"),
  },
  {
    name: "register",
    path: "/register",
    component: () => import("@/views/auth/Register"),
    meta: { title: "Register" },
  },

  {
    name: "login",
    path: "/login",
    component: () => import("@/views/auth/Login"),
    meta: { title: "Login" },
  },

  {
    name: "item-create",
    path: "/item/create",
    component: () => import("@/views/item/Create"),
    meta: { title: "Donate Item", requireAuth: true },
  },
  {
    name: "reset-pass",
    path: "/resetpass",
    component: () => import("@/views/auth/ResetPass"),
    meta: { title: "Reset Password" },
  },
  {
    name: "winner-info",
    path: "/winner/info/:id",
    component: () => import("@/views/winner/WinnerInfo"),
    meta: { title: "Winner Info", requireAuth: true },
  },

  {
    name: "winner-info-receive",
    path: "/winner/receive/:id",
    component: () => import("@/views/winner/WinnerInfoReceive"),
    meta: { title: "Winner Receive", requireAuth: true },
  },

  {
    name: "Im",
    path: "/chat/Im",
    component: () => import("@/views/Im/Im"),
    meta: { title: "Chat" }
  },

  {
    name: "topup-success",
    path: "/topup/success",
    component: () => import("@/views/pay/Topup"),
    meta: { title: "Top Up Success", requireAuth: true },
  },

  {
    name: "payment-success",
    path: "/pay/success",
    component: () => import("@/views/pay/Success"),
    meta: { title: "Pay Success", requireAuth: true },
  },
  {
    name: "payment-cancelled",
    path: "/pay/cancel",
    component: () => import("@/views/pay/Cancel"),
    meta: { title: "Pay Cancelled", requireAuth: true },
  },
  {
    name: "item-pay",
    path: "/item/pay",
    component: () => import("@/views/item/Pay"),
    meta: { title: "Make Payment", requireAuth: true },
  },

  {
    name: 'item-edit',
    path: '/item/edit/:id',
    component: () => import('@/views/item/Edit'),
    meta: {
      title: 'Edit',
      requireAuth: true
    }
  },

  {
    name: "item-detail",
    path: "/item/:id",
    component: () => import("@/views/item/Detail"),
    meta: { title: "Detail" },
  },
  {
    name: 'tag',
    path: '/category/:name',
    component: () => import('@/views/category/Category'),
    meta: { title: 'Item List' }
  },

  {
    name: 'search',
    path: '/search',
    component: () => import('@/views/Search'),
    meta: { title: 'Search' }
  },
  // user profile
  {
    name: 'user',
    path: '/member/:username/home',
    component: () => import('@/views/user/Profile'),
    meta: { title: 'User Profile' }
  },

  {
    name: 'favorite',
    path: '/member/:username/favorite',
    component: () => import('@/views/item/Favorite'),
    meta: { title: 'Favorite List' }
  },

  {
    name: 'user-setting',
    path: '/member/:username/setting',
    component: () => import('@/views/user/Setting'),
    meta: { title: 'Setting', requireAuth: true }
  },

  {
    name: 'user-bid',
    path: '/member/:username/bid',
    component: () => import('@/views/user/Bid'),
    meta: { title: 'Bid', requireAuth: true }
  },

  {
    name: "statistics-fund",
    path: "/statistics/fund",
    component: () => import("@/views/statistics/Fund"),
    meta: { title: "Fund Statistics" }
  },


  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404"),
    meta: { title: "404-NotFound" },
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  routes,
});

export default router;
