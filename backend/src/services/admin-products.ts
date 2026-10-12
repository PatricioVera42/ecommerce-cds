import { HttpError } from "../lib/http-error.js";
import { deleteImage } from "../lib/images.js";
import { prisma } from "../lib/prisma.js";
import type { CreateProductInput, UpdateProductInput } from "../schemas/product.js";

export async function listAllProducts(){
    const productsList = await prisma.product.findMany({ orderBy: { name:"asc" }});
    return productsList;
};

export async function getProductById(id: string){
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product){
        throw new HttpError(404, "Producto no encontrado");
    }
    return product;
};

export async function createProduct(data: CreateProductInput){
    const newProduct = await prisma.product.create({data});
    return newProduct;
};

export async function updateProduct(id: string, data: UpdateProductInput){
    await getProductById(id);
    
    const updatedProduct = await prisma.product.update({where: { id }, data});
    return updatedProduct;
};

export async function setProductImage(id: string, imageKey: string){
    
    const product = await prisma.product.findUnique({ where: { id }});
    if(!product) {
        await deleteImage(imageKey);
        throw new HttpError(404, "Producto no encontrado");
    }
    
    const oldImageKey = product.imageKey;
    const updatedProduct = await prisma.product.update({ where: { id } , data: { imageKey } }); 
    if (oldImageKey){
        await deleteImage(oldImageKey);
    }
    
    return updatedProduct;
};