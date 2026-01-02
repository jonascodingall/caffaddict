<script lang="ts">
    import { onDestroy } from 'svelte';
    import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

    // 1. ÄNDERUNG: Statt EventDispatcher definieren wir eine Funktion, die wir von außen bekommen
    export let onResult: (text: string) => void;
    
    export let readerId = "reader";

    let html5QrCode: Html5Qrcode | null = null;
    let isScanning = false;
    let errorMsg = "";

    onDestroy(() => {
        stopScanner();
    });

    async function startScanner() {
        if (isScanning) return;
        errorMsg = "";
        
        try {
            html5QrCode = new Html5Qrcode(readerId, { 
                verbose: false,
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.EAN_13, 
                    Html5QrcodeSupportedFormats.EAN_8
                ]
            });

            isScanning = true;

            const commonConfig = {
                fps: 10,
                qrbox: { width: 250, height: 150 },
                aspectRatio: 1.0,
                experimentalFeatures: { useBarCodeDetectorIfSupported: true }
            };

            // VERSUCH 1: iPhone (Strikt)
            try {
                await html5QrCode.start(
                    { facingMode: { exact: "environment" } }, 
                    commonConfig,
                    onScanSuccess,
                    () => {} 
                );
            } catch (err) {
                console.warn("Strikter Modus fehlgeschlagen, versuche PC-Modus...");
                
                // VERSUCH 2: PC / Webcam (Locker)
                await html5QrCode.start(
                    { facingMode: "user" }, 
                    commonConfig,
                    onScanSuccess,
                    () => {}
                );
            }

        } catch (err: any) {
            console.error("Totaler Absturz", err);
            isScanning = false;
            errorMsg = "Konnte keine Kamera starten: " + err.toString();
        }
    }

    function onScanSuccess(decodedText: string) {
        if (navigator.vibrate) navigator.vibrate(200);
        stopScanner();
        
        // 2. ÄNDERUNG: Wir rufen einfach die Funktion auf, falls sie existiert
        if (onResult) {
            onResult(decodedText);
        }
    }

    async function stopScanner() {
        if (html5QrCode && isScanning) {
            try {
                await html5QrCode.stop();
                html5QrCode.clear();
            } catch (err) {
                console.log("Stop Error", err);
            }
            isScanning = false;
        }
    }
</script>

<div class="w-full space-y-4">
    <div id={readerId} class="w-full bg-black min-h-75 rounded-xl overflow-hidden relative shadow-lg ring-1 ring-slate-200">
        {#if !isScanning}
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white/40 space-y-2">
                <span class="text-sm font-medium">Kamera bereit</span>
            </div>
        {/if}
    </div>

    {#if errorMsg}
        <div class="p-3 bg-red-50 text-red-600 text-xs font-mono rounded border border-red-200">
            {errorMsg}
        </div>
    {/if}

    {#if !isScanning}
        <button 
            on:click={startScanner} 
            class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-md transition-transform active:scale-95"
        >
            Scan starten
        </button>
    {:else}
        <button 
            on:click={stopScanner} 
            class="w-full py-3 bg-red-100 text-red-600 font-bold rounded-lg border border-red-200"
        >
            Abbrechen
        </button>
    {/if}
</div>