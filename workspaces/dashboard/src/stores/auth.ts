import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
	const isAuthenticated = ref<boolean>(false);
	
	function setAuthentication(authenticated: boolean) {
		isAuthenticated.value = authenticated;
	}

	return { isAuthenticated, setAuthentication };
});
