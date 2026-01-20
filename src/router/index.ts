import { createRouter, createWebHistory } from "vue-router";
import AdminView from "@/views/AdminView.vue";
import UserView from "@/views/UserView.vue";
import LoginVue from "@/views/LoginVue.vue";
import RegisterView from "@/views/RegisterVue.vue";
import { AuthService } from "@/services/AuthService";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginVue },
  { path: "/register", component: RegisterView },
  { path: "/admin", component: AdminView },
  { path: "/user", component: UserView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = AuthService.getCurrentUser();

  // Si no hay usuario y quiere acceder a algo privado
  if (!user && to.path !== "/login" && to.path !== "/register") {
    return next("/login");
  }

  // Solo si existe usuario y tiene rol definido
  if (user && user.role) {
    const role = user.role.toLowerCase();

    if (to.path === "/admin" && role !== "admin") return next("/user");
    if (to.path === "/user" && role !== "user") return next("/admin");
  }

  next();
});


export default router;
