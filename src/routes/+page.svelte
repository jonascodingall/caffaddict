<script lang="ts">
    import Scanner from '$lib/components/Scanner.svelte';

    let lastScan = "";
    let showResult = false;

    function handleDetection(eanCode: string) {
        lastScan = eanCode;
        showResult = true;
        console.log("Barcode:", eanCode);
    }
</script>

<div class="max-w-md mx-auto p-4 space-y-6">
    <h1 class="text-3xl font-black text-center text-slate-800 tracking-tight">
        CaffAddict ⚡️
    </h1>

    {#if showResult}
        <div class="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 shadow-sm">
            <div>
                <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Gefunden</p>
                <p class="text-4xl font-mono font-black text-slate-800 mt-1">{lastScan}</p>
            </div>
            <button 
                class="w-full py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                on:click={() => showResult = false}
            >
                Weiter
            </button>
        </div>
    {:else}
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <Scanner onResult={handleDetection} />
            
            <p class="text-xs text-center text-slate-400 mt-4">
                Halte den Code quer ("Leiter") bei Spiegelungen.
            </p>
        </div>
    {/if}
</div>