import "dotenv/config"
import * as z from "zod"

const EnvSchema = z.object({
    DATABASE_URL: z.string().min(1),
    PORT: z.coerce.number().int().positive().default(3000),
    JWT_SECRET: z.string().min(32),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_test_", { error: "La clave de Stripe tiene que ser de prueba" }),
    FRONTEND_URL: z.url()
});

export const env = EnvSchema.parse(process.env);