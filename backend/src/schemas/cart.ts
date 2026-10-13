import * as z from "zod";


export const addCartItemBody = z.object({
    productId: z.string({ error: "El producto debe ser una string" }).
                trim().min(1, "El producto es obligatorio"),
    quantity: z.number({ error: "La cantidad tiene que ser un número" })
                .int({ error: "La cantidad tiene que ser un entero" })
                .positive({ error: "La cantidad tiene que ser un número positivo" })
                .max(99, { error: "La cantidad máxima permitida es 99" }),
});

export const updateCartItemBody = z.object({
    quantity: z.number({ error: "La cantidad tiene que ser un número" })
            .int({ error: "La cantidad tiene que ser un entero" })
            .positive({ error: "La cantidad tiene que ser un número positivo" })
            .max(99, { error: "La cantidad máxima permitida es 99" }),
});
