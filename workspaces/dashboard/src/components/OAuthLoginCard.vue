<script setup lang="ts">
	import { computed, onMounted, ref } from "vue";
	import { AuthAPI } from "../api/Auth";

	const authAPI = new AuthAPI();

	const successful = ref<boolean>(false);
	const authURL = ref<string | undefined>();

	onMounted(async () => {
		try {
			const response = await authAPI.getOAuthURL();
			successful.value = true;
			authURL.value = response.url;
		} catch(error) {
			successful.value = false;
			console.log(error);
		}
	});

	const computedButtonText = computed(() => {
		if(successful.value && typeof authURL.value !== "undefined") {
			return "Login";
		} else {
			return "...";
		}
	});

	function redirectToAuthLink() {
		if(successful.value && typeof authURL.value !== "undefined") {
			window.location.replace(authURL.value);
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
				type="button"
				@click.prevent="redirectToAuthLink"
			>{{ computedButtonText }}</button>
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
