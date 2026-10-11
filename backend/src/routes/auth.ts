import { Router } from "express";
import { register } from "../services/auth.js";
import * as z from "zod";

export const authRouter = Router();

const registerBody = z.object({
    name: z.string().min(1, {error: "El nombre es obligatorio" }),
    email: z.email({ error: "El mail debe ser de un formato válido" }).transform((valor) => valor.toLowerCase()),
    password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
});

authRouter.post("/register", async (req, res) => {
    const data = registerBody.parse(req.body);
    const result = await register(data);
    res.status(201).json(result);
});