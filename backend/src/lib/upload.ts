import { randomUUID } from "node:crypto";
import multer from "multer";
import { HttpError } from "./http-error.js";

const EXTENSIONS: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (_req, file, cb) => {
        cb(null, randomUUID() + EXTENSIONS[file.mimetype]);   
    }
});

export const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if(Object.hasOwn(EXTENSIONS, file.mimetype)) {
            cb(null, true);
        } else {
            cb(new HttpError(415, "Solo se aceptan imágenes JPEG, PNG o WebP"));
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024,
    }
})

