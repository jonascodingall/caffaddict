import { superValidate, message } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { scanSchema, drinkSchema, consumptionSchema } from "$lib/schemas"; // logSchema importieren
import { Collections } from "$lib/pocketbase-types";
import { fail, type Actions } from "@sveltejs/kit";

export const load = async () => {
    const scanForm = await superValidate(zod4(scanSchema), { id: "scan-form" });
    const createForm = await superValidate(zod4(drinkSchema), {
        id: "create-form",
    });

    // NEU: Log Formular
    const logForm = await superValidate(zod4(consumptionSchema), {
        id: "log-form",
    });

    return { scanForm, createForm, logForm };
};

export const actions: Actions = {
    scan: async ({ request, locals }) => {
        // ... (dein existierender Code bleibt gleich) ...
        const form = await superValidate(request, zod4(scanSchema), {
            id: "scan-form",
        });
        if (!form.valid) return fail(400, { scanForm: form });

        try {
            const result = await locals.pb
                .collection(Collections.Drinks)
                .getList(1, 1, {
                    filter: `ean = "${form.data.ean}"`,
                });
            const drink = result.items[0];

            if (drink) {
                // WICHTIG: Wir geben hier die Drink-ID mit zurück!
                return message(form, { status: "found", drink });
            } else {
                return message(form, {
                    status: "not_found",
                    ean: form.data.ean,
                });
            }
        } catch (err) {
            return message(
                form,
                { status: "error", text: "DB Fehler" },
                { status: 500 }
            );
        }
    },

    create: async ({ request, locals }) => {
        // ... (dein existierender Code bleibt gleich) ...
        const form = await superValidate(request, zod4(drinkSchema), {
            id: "create-form",
        });
        if (!form.valid) return fail(400, { createForm: form });

        try {
            await locals.pb.collection(Collections.Drinks).create(form.data);
            return message(form, {
                status: "created",
                text: "Getränk angelegt!",
            });
        } catch (err) {
            return message(
                form,
                { status: "error", text: "Save Error" },
                { status: 500 }
            );
        }
    },

    // NEU: Action zum Loggen des Konsums
    logConsumption: async ({ request, locals }) => {
        const form = await superValidate(request, zod4(consumptionSchema), {
            id: "log-form",
        });

        if (!locals.user) {
            return message(
                form,
                { status: "error", text: "Nicht eingeloggt." },
                { status: 401 }
            );
        }

        if (!form.valid) return fail(400, { logForm: form });

        try {
            await locals.pb.collection(Collections.Consumption).create({
                user: locals.user.id,
                drink: form.data.drinkId,
                // created/updated setzt PocketBase automatisch auf "jetzt"
            });
            return message(form, { status: "logged", text: "Gönn dir! ☕️" });
        } catch (err) {
            console.error(err);
            return message(
                form,
                { status: "error", text: "Konnte nicht geloggt werden." },
                { status: 500 }
            );
        }
    },
};
