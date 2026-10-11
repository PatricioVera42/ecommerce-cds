import type { RequestHandler } from "express";
import { HttpError } from "../lib/http-error.js";

export const requireAdmin: RequestHandler = (req, _res, next) => {
    if(req.user?.role !== "ADMIN"){
        throw new HttpError(403, "Permisos denegados");
    }
    next();
};