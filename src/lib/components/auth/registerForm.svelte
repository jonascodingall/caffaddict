<script lang="ts">
    import * as Form from "$lib/components/ui/form/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { registerSchema, type RegisterFormSchema } from "$lib/schema";
    import {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters"; // Using modern zodClient

    // 1. Use Svelte 5 $props
    let {
        data,
    }: { data: { form: SuperValidated<Infer<RegisterFormSchema>> } } = $props();

    // 2. Initialize the form
    const form = superForm(data.form, {
        validators: zod4Client(registerSchema),
    });

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
    <Form.Field {form} name="name">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Name</Form.Label>
                <Input {...props} bind:value={$formData.name} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="email">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Email</Form.Label>
                <Input {...props} bind:value={$formData.email} type="email" />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="password">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Password</Form.Label>
                <Input
                    {...props}
                    bind:value={$formData.password}
                    type="password"
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="passwordConfirm">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Confirm Password</Form.Label>
                <Input
                    {...props}
                    bind:value={$formData.passwordConfirm}
                    type="password"
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Button class="mt-5 w-full">Submit</Form.Button>
</form>
