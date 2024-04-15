import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home"),
  },
  {
    path: "/register",
    name: "register",
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
    name: 'user-setting',
    path: '/member/:username/setting',
    component: () => import('@/views/user/Setting'),
    meta: { title: 'Setting', requireAuth: true }
  },

  {
    name: "statistics-fund",
    path: "/statistics/fund",
    component: () => import("@/views/statistics/Fund"),
    meta: { title: "Fund Statistics"}
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
