import { z } from "zod";

export const scanSchema = z.object({
    ean: z
        .string()
        .min(8, "Der EAN-Code ist zu kurz.")
        .max(13, "Der EAN-Code ist zu lang."),
});

export const drinkSchema = z.object({
    ean: z.string().min(8).max(13),
    name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein."),
    brand: z.string().optional(),
    caffeine_mg: z.coerce
        .number()
        .min(0, "Koffein darf nicht negativ sein.")
        .default(0),
    sugar_g: z.coerce.number().min(0).optional().default(0),
    volume_ml: z.coerce
        .number()
        .positive("Menge muss größer als 0 sein.")
        .default(330),
});

export const consumptionSchema = z.object({
    drinkId: z.string().min(1),
});

export type ScanSchema = typeof scanSchema;
export type DrinkSchema = typeof drinkSchema;
export type ConsumptionSchema = typeof consumptionSchema;
