import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";


export async function listProducts(search?: string){
    const productsList = await prisma.product.findMany(
        { where: { name: { contains: search, mode: "insensitive" }, active: true }, 
        orderBy: { name: "asc" } });
    return productsList;
}

export async function getProduct(id: string){
    const product = await prisma.product.findFirst({ where: { id, active: true } });
    if (!product){
        throw new HttpError(404, "Producto no encontrado");
    }
    return product;
}