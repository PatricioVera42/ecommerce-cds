import { rm } from "node:fs/promises";
import path from "node:path";


export async function deleteImage(imageKey: string){
    const fullPath = path.resolve("uploads", imageKey);
    await rm(fullPath, { force: true });
} 