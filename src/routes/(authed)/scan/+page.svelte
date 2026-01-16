<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import Scanner from "$lib/components/Scanner.svelte";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
        CardFooter,
    } from "$lib/components/ui/card";
    import { ArrowLeft, CirclePlus, CircleCheck, Coffee } from "@lucide/svelte";

    let props = $props();

    let view = $state("scanner");

    const scanForm = superForm(props.data.scanForm, {
        id: "scan-form",
        validators: "clear",
        onUpdated({ form }) {
            if (form.message?.status === "found") {
                view = "result";
            } else if (form.message?.status === "not_found") {
                $createFormData.ean = form.message.ean;
                view = "create";
            }
        },
    });
    const {
        form: scanFormData,
        enhance: scanEnhance,
        message: scanMessage,
        delayed: scanDelayed,
    } = scanForm;

    const createForm = superForm(props.data.createForm, {
        id: "create-form",
        validators: "clear",
        onUpdated({ form }) {
            if (form.message?.status === "created") {
                alert("Getränk angelegt! Scanne es jetzt zum Trinken.");
                resetToScanner();
            }
        },
    });
    const {
        form: createFormData,
        enhance: createEnhance,
        delayed: createDelayed,
    } = createForm;

    const logForm = superForm(props.data.logForm, {
        id: "log-form",
        onUpdated({ form }) {
            if (form.message?.status === "logged") {
                alert(form.message.text);
                resetToScanner();
            }
        },
    });
    const {
        form: logFormData,
        enhance: logEnhance,
        delayed: logDelayed,
    } = logForm;

    function handleScanResult(ean: string) {
        $scanFormData.ean = ean;
        setTimeout(() => {
            const btn = document.getElementById("hidden-scan-submit");
            if (btn instanceof HTMLElement) btn.click();
        }, 100);
    }

    function resetToScanner() {
        $scanFormData.ean = "";
        view = "scanner";
    }
</script>

<div class="container max-w-lg mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-6 text-center tracking-tight">
        CaffAddict
    </h1>

    <form method="POST" action="?/scan" use:scanEnhance class="hidden">
        <input name="ean" bind:value={$scanFormData.ean} />
        <button id="hidden-scan-submit" type="submit">Scan</button>
    </form>

    {#if view === "scanner"}
        <Card>
            <CardHeader>
                <CardTitle>Scan</CardTitle>
                <CardDescription
                    >Halte den Barcode in die Kamera.</CardDescription
                >
            </CardHeader>
            <CardContent>
                {#if $scanDelayed}
                    <div
                        class="flex flex-col items-center justify-center py-10 gap-4"
                    >
                        <div
                            class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
                        ></div>
                        <p class="text-muted-foreground animate-pulse">
                            Suche in Datenbank...
                        </p>
                    </div>
                {:else}
                    <Scanner onResult={handleScanResult} />
                {/if}
            </CardContent>
        </Card>
    {:else if view === "result" && $scanMessage?.drink}
        <Card class="border-primary/50">
            <CardHeader>
                <div class="flex items-center gap-2 text-primary mb-2">
                    <CircleCheck class="w-6 h-6" />
                    <span class="font-bold">Gefunden</span>
                </div>
                <CardTitle>{$scanMessage.drink?.name}</CardTitle>
                <CardDescription>
                    {$scanMessage.drink?.brand || "Keine Marke"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div class="bg-muted p-3 rounded-md text-center">
                        <span
                            class="block text-muted-foreground text-xs uppercase tracking-wider"
                            >Koffein</span
                        >
                        <span class="font-bold text-xl"
                            >{$scanMessage.drink?.caffeine_mg}</span
                        > <span class="text-xs">mg</span>
                    </div>
                    <div class="bg-muted p-3 rounded-md text-center">
                        <span
                            class="block text-muted-foreground text-xs uppercase tracking-wider"
                            >Zucker</span
                        >
                        <span class="font-bold text-xl"
                            >{$scanMessage.drink?.sugar_g}</span
                        > <span class="text-xs">g</span>
                    </div>
                </div>

                <form method="POST" action="?/logConsumption" use:logEnhance>
                    <input
                        type="hidden"
                        name="drinkId"
                        value={$scanMessage.drink.id}
                    />

                    <Button
                        type="submit"
                        size="lg"
                        class="w-full gap-2 text-lg h-14"
                        disabled={$logDelayed}
                    >
                        {#if $logDelayed}
                            Buche...
                        {:else}
                            <Coffee class="w-6 h-6" />
                            Jetzt trinken
                        {/if}
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    variant="ghost"
                    onclick={resetToScanner}
                    class="w-full text-muted-foreground"
                >
                    Nicht trinken, nur scannen
                </Button>
            </CardFooter>
        </Card>
    {:else if view === "create"}
        <Card>
            <CardHeader>
                <CardTitle>Neues Getränk</CardTitle>
                <CardDescription>
                    Code <strong>{$createFormData.ean}</strong> ist neu.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    method="POST"
                    action="?/create"
                    use:createEnhance
                    id="create-drink-form"
                    class="space-y-4"
                >
                    <input
                        type="hidden"
                        name="ean"
                        value={$createFormData.ean}
                    />

                    <Form.Field form={createForm} name="name">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Produktname</Form.Label>
                                <Input
                                    {...props}
                                    bind:value={$createFormData.name}
                                    placeholder="Name des Getränks"
                                />
                            {/snippet}
                        </Form.Control>
                        <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field form={createForm} name="brand">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Marke</Form.Label>
                                <Input
                                    {...props}
                                    bind:value={$createFormData.brand}
                                    placeholder="Marke (optional)"
                                />
                            {/snippet}
                        </Form.Control>
                    </Form.Field>

                    <div class="grid grid-cols-2 gap-4">
                        <Form.Field form={createForm} name="caffeine_mg">
                            <Form.Control>
                                {#snippet children({ props })}
                                    <Form.Label>Koffein (mg)</Form.Label>
                                    <Input
                                        type="number"
                                        {...props}
                                        bind:value={$createFormData.caffeine_mg}
                                    />
                                {/snippet}
                            </Form.Control>
                        </Form.Field>

                        <Form.Field form={createForm} name="volume_ml">
                            <Form.Control>
                                {#snippet children({ props })}
                                    <Form.Label>Inhalt (ml)</Form.Label>
                                    <Input
                                        type="number"
                                        {...props}
                                        bind:value={$createFormData.volume_ml}
                                    />
                                {/snippet}
                            </Form.Control>
                        </Form.Field>
                    </div>

                    <Form.Field form={createForm} name="sugar_g">
                        <Form.Control>
                            {#snippet children({ props })}
                                <Form.Label>Zucker (g)</Form.Label>
                                <Input
                                    type="number"
                                    {...props}
                                    bind:value={$createFormData.sugar_g}
                                />
                            {/snippet}
                        </Form.Control>
                    </Form.Field>
                </form>
            </CardContent>
            <CardFooter class="flex flex-col gap-2">
                <Button
                    type="submit"
                    form="create-drink-form"
                    disabled={$createDelayed}
                    class="w-full"
                >
                    {#if $createDelayed}
                        Speichere...
                    {:else}
                        <CirclePlus class="mr-2 h-4 w-4" /> Speichern
                    {/if}
                </Button>
                <Button variant="ghost" onclick={resetToScanner} class="w-full">
                    <ArrowLeft class="mr-2 h-4 w-4" /> Abbrechen
                </Button>
            </CardFooter>
        </Card>
    {/if}
</div>
