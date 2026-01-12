import { type Actions } from "@sveltejs/kit";

export const load = async () => {};

export const actions: Actions = {
    default: async ({ request }) => {
        let data = await request.formData();
        let ean = data.get("ean");

        let product = await fetch(
            "https://world.openfoodfacts.org/api/v2/product/" + ean
        );
        console.log(await product.json());
    },
};
