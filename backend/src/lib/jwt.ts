import jwt from "jsonwebtoken";
import { env } from "./env.js";
import * as z from "zod";
import { HttpError } from "./http-error.js";

export function signToken(data: {id: string, role: string}){
    return jwt.sign({ sub: data.id, role: data.role }, env.JWT_SECRET, {algorithm: "HS256",expiresIn: "1d" });
};

const tokenPayload = z.object({
    sub: z.string(),
    role: z.enum(["CUSTOMER", "ADMIN"]),
});

export function verifyToken(token: string){
    try{
        const rawPayload = jwt.verify(token, env.JWT_SECRET, {algorithms: ["HS256"]});
        const payload = tokenPayload.parse(rawPayload);
        return { id: payload.sub, role: payload.role };
    } catch {
        throw new HttpError(401, "Token inválido o vencido");
    }
};