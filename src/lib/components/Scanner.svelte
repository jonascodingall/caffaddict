<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
    import { Button } from "$lib/components/ui/button";
    import {
        Alert,
        AlertDescription,
        AlertTitle,
    } from "$lib/components/ui/alert";
    import { LoaderCircle, Camera, CircleStop } from "@lucide/svelte";

    export let onResult: (text: string) => void;
    export let readerId = "reader";

    let html5QrCode: Html5Qrcode | null = null;
    let isScanning = false;
    let errorMsg = "";
    let isStarting = false;

    onDestroy(() => {
        stopScanner();
    });

    async function startScanner() {
        if (isScanning || isStarting) return;
        isStarting = true;
        errorMsg = "";

        try {
            if (!html5QrCode) {
                html5QrCode = new Html5Qrcode(readerId, {
                    verbose: false,
                    formatsToSupport: [
                        Html5QrcodeSupportedFormats.EAN_13,
                        Html5QrcodeSupportedFormats.EAN_8,
                    ],
                });
            }

            const commonConfig = {
                fps: 10,
                qrbox: { width: 250, height: 150 },
                aspectRatio: 1.0,
                experimentalFeatures: { useBarCodeDetectorIfSupported: true },
            };

            try {
                await html5QrCode.start(
                    { facingMode: { exact: "environment" } },
                    commonConfig,
                    onScanSuccess,
                    () => {},
                );
            } catch (err) {
                console.warn(
                    "Environment mode failed, trying user facing...",
                    err,
                );
                await html5QrCode.start(
                    { facingMode: "user" },
                    commonConfig,
                    onScanSuccess,
                    () => {},
                );
            }

            isScanning = true;
        } catch (err: any) {
            console.error("Scanner Start Error", err);
            errorMsg =
                "Kamera konnte nicht gestartet werden. Bitte Berechtigungen prüfen.";
        } finally {
            isStarting = false;
        }
    }

    function onScanSuccess(decodedText: string) {
        if (navigator.vibrate) navigator.vibrate(200);
        stopScanner();
        onResult(decodedText);
    }

    async function stopScanner() {
        if (html5QrCode && isScanning) {
            try {
                await html5QrCode.stop();
            } catch (err) {
                console.log("Stop Error", err);
            }
            isScanning = false;
        }
    }
</script>

<div class="flex flex-col gap-4 w-full max-w-md mx-auto">
    <div
        class="relative overflow-hidden rounded-xl border bg-black shadow-inner aspect-square flex items-center justify-center"
    >
        <div id={readerId} class="w-full h-full"></div>

        {#if !isScanning && !isStarting}
            <div
                class="absolute inset-0 flex items-center justify-center bg-muted/10 text-muted-foreground pointer-events-none"
            >
                <Camera class="w-16 h-16 opacity-20" />
            </div>
        {/if}
    </div>

    {#if errorMsg}
        <Alert variant="destructive">
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
    {/if}

    <div class="flex justify-center">
        {#if !isScanning}
            <Button onclick={startScanner} disabled={isStarting} class="w-full">
                {#if isStarting}
                    <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
                    Starte Kamera...
                {:else}
                    Scan starten
                {/if}
            </Button>
        {:else}
            <Button onclick={stopScanner} variant="destructive" class="w-full">
                <CircleStop class="mr-2 h-4 w-4" />
                Abbrechen
            </Button>
        {/if}
    </div>
</div>
