import { AuthAPI } from "@/api/Auth";
import { useAuthStore } from "@/stores/auth";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import type { RouteRecordRaw } from "vue-router";

export type MetaRouteRecordArray = readonly (RouteRecordRaw & RouteMeta)[];
export type RouteMeta = {
	meta: {
		title: string;
	}
}

export const routes: MetaRouteRecordArray = [
	{
		path: "/",
		name: "home",
		component: HomeView,
		meta: {
			title: "Home"
		},
		beforeEnter: async () => {
			const authAPI = new AuthAPI();
			const authStore = useAuthStore();

			const authenticated = await authAPI.getAuthStatus();
			authStore.setAuthentication(authenticated);

			if(!authStore.isAuthenticated) {
				return "/login";
			}
		}
	},
	{
		path: "/login",
		name: "login",
		component: LoginView,
		meta: {
			title: "Login"
		}
	}
];
