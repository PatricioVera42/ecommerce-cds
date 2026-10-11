import "dotenv/config"
import * as z from "zod"

const EnvSchema = z.object({
    DATABASE_URL: z.string().min(1),
    PORT: z.coerce.number().int().positive().default(3000),
    JWT_SECRET: z.string().min(32)
});

export const env = EnvSchema.parse(process.env);