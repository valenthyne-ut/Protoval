<script setup lang="ts"></script>

<template>
	<span class="spinner" />
</template>

<style scoped lang="scss">
	.spinner {
		width: 24px;
		height: 24px;
		border: 4px solid white;
		border-top-color: #4f46e5;
		border-radius: 100%;
		animation: spin 2s infinite linear;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>
