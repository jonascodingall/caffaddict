<script lang="ts">
    import LoginFrom from "$lib/components/auth/loginForm.svelte";
    import * as Card from "$lib/components/ui/card";
    import type { PageData } from "./$types";
    let { data }: { data: PageData } = $props();
</script>

<div class="flex items-center justify-center pt-20">
    <Card.Root class="w-full max-w-md">
        <Card.Header>
            <Card.Title class="text-2xl">Login</Card.Title>
        </Card.Header>
        <Card.Content>
            <LoginFrom {data} />
        </Card.Content>
    </Card.Root>
</div>
