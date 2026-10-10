import type { RequestHandler } from "express";
import { HttpError } from "../lib/http-error.js";

export const notFound: RequestHandler = (_req, _res, _next) => {
    throw new HttpError(404, "Ruta no encontrada");
};