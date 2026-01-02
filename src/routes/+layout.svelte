<script lang="ts">
	import './layout.css';

	import { browser } from '$app/environment';
	import { setUserContext } from '$lib/contexts/userContext';
	import { pb } from '$lib/pocketbase';
	import { onDestroy, type Snippet } from 'svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { goto } from '$app/navigation';

	interface Props {
		data: PageData;
		children?: Snippet;
	}

	let { data, children }: Props = $props();

	// Initialize user store
	// svelte-ignore state_referenced_locally
		const user = writable(data.user);
	setUserContext(user);

	if (browser) {
		// Load user from cookie (client-side only)
		pb.authStore.loadFromCookie(document.cookie);

		// Update user store when auth store changes
		const unsubscribe = pb.authStore.onChange(() => {
			user.set(pb.authStore.record);
			document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
		}, true);
		onDestroy(unsubscribe);
	}

	let logoutForm = $state<HTMLFormElement>();
</script>

<div>
	<header class="flex h-16 items-center justify-between px-6">
		<div>
			{#if data.user}
				Angemeldet als: {data.user.email}
			{:else}
				Nicht angemeldet
			{/if}
		</div>

		<div class="flex gap-2">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props }: { props: any })}
						<Avatar.Root {...props} class="rounded-lg">
							<Avatar.Image src="https://github.com/evilrabbit.png" alt="@user" />
							<Avatar.Fallback>usr</Avatar.Fallback>
						</Avatar.Root>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="start">
					{#if !data.user}
						<DropdownMenu.Item onclick={() => goto('/login')}>Login</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => goto('/register')}>Register</DropdownMenu.Item>
					{:else}
						<form method="POST" action="/logout" bind:this={logoutForm}>
							<DropdownMenu.Item onclick={() => logoutForm?.submit()}>Log out</DropdownMenu.Item>
						</form>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>

	<Separator />

	<main class="flex flex-col">
		{@render children?.()}
	</main>
</div>
