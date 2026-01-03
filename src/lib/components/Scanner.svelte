<script lang="ts">
  import { onDestroy } from "svelte";
  import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

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
          Html5QrcodeSupportedFormats.EAN_8,
        ],
      });

      isScanning = true;

      const commonConfig = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.0,
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      };

      // VERSUCH 1: iPhone (Strikt)
      try {
        await html5QrCode.start(
          { facingMode: { exact: "environment" } },
          commonConfig,
          onScanSuccess,
          () => {},
        );
      } catch (err) {
        console.warn("Strikter Modus fehlgeschlagen, versuche PC-Modus...");

        // VERSUCH 2: PC / Webcam (Locker)
        await html5QrCode.start(
          { facingMode: "user" },
          commonConfig,
          onScanSuccess,
          () => {},
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

<div>
  <div id={readerId}>
    {#if !isScanning}
      <div>
        <span>Kamera bereit</span>
      </div>
    {/if}
  </div>

  {#if errorMsg}
    <div>
      {errorMsg}
    </div>
  {/if}

  {#if !isScanning}
    <button on:click={startScanner}> Scan starten </button>
  {:else}
    <button on:click={stopScanner}> Abbrechen </button>
  {/if}
</div>
