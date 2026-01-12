<script lang="ts">
    let ean = $state("");

    let json = $state("");
    let submit = async () => {
        let data = await fetch(
            "https://world.openfoodfacts.org/api/v2/product/" + ean,
        );
        json = await data.json();
    };
</script>

<input bind:value={ean} placeholder="ean" />
<button onclick={submit}>submit</button>
<p>{json}</p>
