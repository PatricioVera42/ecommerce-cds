import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { getProduct } from "./products.js";

export async function getCart(userId: string){
    const itemsList = await prisma.cartItem.findMany({ 
        where: { userId },
        orderBy: { product: { name: "asc" } }, 
        select: { productId: true, quantity: true, product: true }, 
    });

    const items = itemsList.map((item) => ({
        ... item,
        subtotal: item.product.price * item.quantity
    }));

    const total = items.reduce((ac, item) => item.product.active ? ac + item.subtotal : ac, 0);

    return { items, total }
};

export async function addCartItem(userId: string, productId: string, quantity: number){
    await getProduct(productId); // esto me asegura que exista el producto, no es necesario el error porque getProduct ya se encarga

    const cartItem = await prisma.cartItem.findUnique({ 
        where: { userId_productId: { userId, productId } } });
    
    const currentQuantity = cartItem?.quantity ?? 0; 
    
    const newQuantity = currentQuantity + quantity; 
    if( newQuantity> 99) {
        throw new HttpError(400, `El máximo de unidades por producto es de 99, podés agregar ${99 - currentQuantity}`)
    };

    await prisma.cartItem.upsert({
        where: { userId_productId: { userId, productId } },
        create: { userId, productId, quantity: newQuantity },
        update: {quantity: newQuantity },
    });

    return getCart(userId);
};

export async function updateCartItem(userId: string, productId: string, quantity: number){
    const cartItem = await prisma.cartItem.findUnique({ 
        where: { userId_productId: { userId, productId } } });

    if(!cartItem) throw new HttpError(404, "El producto no pertenece a este carrito");

    await prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity }
    })

    return getCart(userId);
};

export async function removeCartItem(userId: string, productId: string){
    const cartItem = await prisma.cartItem.findUnique({ 
        where: { userId_productId: { userId, productId } } });

    if(!cartItem) throw new HttpError(404, "El producto no pertenece a este carrito");

    await prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } },
    });

    return getCart(userId);
};
