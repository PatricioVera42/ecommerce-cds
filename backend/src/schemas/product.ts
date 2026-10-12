import * as z from "zod";


export const createProductBody = z.object({
    name: z.string().trim().min(1, {error: "El nombre es obligatorio"}),
    description: z.string().trim().min(1, {error: "La descripción es obligatoria"}),
    price: z.number({error: "El precio tiene que ser un número"})
            .int({error: "El precio tiene que estar en centavos (número entero)"})
            .positive({error: "El precio tiene que ser un número positivo"})
            .max(1_000_000, {error: "El precio no puede superar los 10.000 USD"}),
    active: z.boolean().optional()    
});

export const updateProductBody = createProductBody.partial();

export type CreateProductInput = z.infer<typeof createProductBody>;
export type UpdateProductInput = z.infer<typeof updateProductBody>
