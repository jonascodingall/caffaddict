import { registerSchema } from "$lib/schema";
import { fail, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";

export const load = async () => {
    const form = await superValidate(zod4(registerSchema));
    return { form };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod4(registerSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        await event.locals.pb.collection("users").create(form.data);
        await event.locals.pb
            .collection("users")
            .authWithPassword(form.data.email, form.data.password);

        return { form };
    },
};
