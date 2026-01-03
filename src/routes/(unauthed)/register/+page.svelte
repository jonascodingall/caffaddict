<script lang="ts">
    import RegisterForm from "$lib/components/auth/registerForm.svelte";
    import * as Card from "$lib/components/ui/card";
    import type { PageData } from "./$types";
    let { data }: { data: PageData } = $props();
</script>

<div class="flex items-center justify-center pt-20">
    <Card.Root class="w-full max-w-md">
        <Card.Header>
            <Card.Title class="text-2xl">Register</Card.Title>
        </Card.Header>
        <Card.Content>
            <RegisterForm {data} />
        </Card.Content>
    </Card.Root>
</div>
