<script lang="ts">
    import Scanner from "$lib/components/Scanner.svelte";

    let lastScan = "";
    let showResult = false;

    function handleDetection(eanCode: string) {
        lastScan = eanCode;
        showResult = true;
        console.log("Barcode:", eanCode);
    }
</script>

<div>
    <h1>CaffAddict</h1>
    {#if showResult}
        <div>
            <div>
                <p>Gefunden</p>
                <p>
                    {lastScan}
                </p>
            </div>
            <button on:click={() => (showResult = false)}> Weiter </button>
        </div>
    {:else}
        <div>
            <Scanner onResult={handleDetection} />
            <p>Halte den Code quer ("Leiter") bei Spiegelungen.</p>
        </div>
    {/if}
</div>
