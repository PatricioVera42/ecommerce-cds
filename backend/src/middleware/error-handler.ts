import type { ErrorRequestHandler } from "express";
import * as z from "zod";
import { HttpError } from "../lib/http-error.js";
import multer from "multer";

export const errorHandler:  ErrorRequestHandler = (err, _req, res, _next) => {
    if(err instanceof HttpError){
        res.status(err.status).json({error: { message: err.message }});
    } else if (err instanceof z.ZodError){
        res.status(400).json({error: {message: "Datos inválidos", details: z.flattenError(err).fieldErrors}});
    }else if(err.type === "entity.parse.failed"){
        res.status(400).json({error: {message: "El cuerpo de la request no es un JSON válido"}});
    } else if(err instanceof multer.MulterError){
        if (err.code === "LIMIT_FILE_SIZE") res.status(413).json({ error: { message: "El archivo no puede superar los 2 MB" } })
        else res.status(400).json({ error: { message: "Enviá una sola imagen en el campo \"image\"" } });
    } else{
        console.error(err);
        res.status(500).json({error: {message: "Error interno"}});
    };
};