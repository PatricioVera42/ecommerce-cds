import type { RequestHandler } from "express";
import { HttpError } from "../lib/http-error.js";
import { verifyToken } from "../lib/jwt.js";


export const requireAuth: RequestHandler = (req, _res, next) => {
    const header = req.headers.authorization;
    const [scheme, token] = header?.split(" ") ?? [];
    if(scheme !== "Bearer" || !token){
        throw new HttpError(401, "Falta el token de autenticación.");
    }
    req.user = verifyToken(token);
    next();
};