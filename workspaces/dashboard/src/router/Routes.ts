import HomeView from "@/views/HomeView.vue";
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
		}
	}
];
