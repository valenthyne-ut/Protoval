import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import { routes } from "./Routes";

const DEFAULT_ROUTE_TITLE = "Protoval";

function setTitle(to: RouteLocationNormalized & { meta?: { title?: string } }) {
	if(to.meta.title) { document.title = to.meta.title; }
	else { document.title = DEFAULT_ROUTE_TITLE; }
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach((to, from) => {
	setTitle(to);
});

export default router;
