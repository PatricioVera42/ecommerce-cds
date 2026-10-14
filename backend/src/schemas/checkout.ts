import * as z from "zod";


export const confirmCheckoutBody = z.object({
    sessionId: z.string().trim().min(1, "La sesión de Stripe debe ser válida")
})