<script setup lang="ts">
	import { AuthAPI } from "@/api/Auth";
	import { onMounted, ref } from "vue";
	import vSpinner from "./vSpinner.vue";

	const authAPI = new AuthAPI(); 

	const url = ref<string | undefined>();
	const errorOccurred = ref<boolean>(false);

	onMounted(async () => {
		try {
			const response = await authAPI.getOAuthURL();
			url.value = response.url;
		} catch(error) {
			errorOccurred.value = true;
			console.log(error);
		}
	});

	function redirect() {
		if(url.value) {
			window.location.replace(url.value);
		}
	}
</script>

<template>
	<section class="oauth-login-card">
		<span class="card-header">
			<h1>Login through Discord</h1>
			<h2>Authorize yourself through Discord to access this Protoval instance's dashboard.</h2>
		</span>
		<span class="card-body">
			<button
				v-if="url"
				@click.prevent="redirect"
			>Authorize</button>
			<span
				v-else-if="errorOccurred"
				class="error"
			>An error occurred while getting you an authorization link. Please, refresh the page.</span>
			<vSpinner v-else />
		</span>
	</section>
</template>

<style scoped lang="scss">
	section.oauth-login-card {
		display: flex;
		flex-direction: column;
		border-radius: 8px;
		background-color: #27272a;

		@media screen and (min-width: 0px) { width: calc(100% / 10) * 7 }
		@media screen and (min-width: 640px) { width: calc(100% / 10) * 6 }
		@media screen and (min-width: 768px) { width: calc(100% / 10) * 5 }
		@media screen and (min-width: 1024px) { width: calc(100% / 10) * 4 }
		@media screen and (min-width: 1280px) { width: calc(100% / 10) * 3 }
		@media screen and (min-width: 1536px) { width: calc(100% / 10) * 2 }
	}

	.card-header {
		padding: 1.5em;
		font-weight: bold;
		background-color: #4f46e5;
		border-radius: 8px 8px 0px 0px;
	}

	.card-header h1 {
		font-size: large;
	}

	.card-header h2 {
		padding-top: 0.5em;
		text-align: justify;
		font-size: small;
		color: #ffffffcc;
	}

	.card-body {
		display: flex;
		justify-content: center;
		padding: 2em;
	}

	.card-body .error {
		text-align: justify;
		font-size: small;
		font-weight: bold;
		color: #dc2626;
	}

	.card-body button {
		width: 100%;
		padding: 0.5em 2em;
		border-radius: 4px;
		background-color: #3f3f46;
		transition: background-color 150ms;
	}

	.card-body button:hover {
		background-color: #4f46e5;
	}

	.card-body button:active {
		background-color: #4338ca;
	}
</style>
