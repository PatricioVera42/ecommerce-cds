import type { ErrorRequestHandler } from "express";
import * as z from "zod";
import { HttpError } from "../lib/http-error.js";

export const errorHandler:  ErrorRequestHandler = (err, _req, res, _next) => {
    if(err instanceof HttpError){
        res.status(err.status).json({error: { message: err.message }});
    } else if (err instanceof z.ZodError){
        res.status(400).json({error: {message: "Datos inválidos", details: z.flattenError(err).fieldErrors}});
    }else if(err.type === "entity.parse.failed"){
        res.status(400).json({error: {message: "El cuerpo de la request no es un JSON válido"}});
    } else{
        console.error(err);
        res.status(500).json({error: {message: "Error interno"}});
    };
};