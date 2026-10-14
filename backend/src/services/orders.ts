import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { closePendingOrder } from "./checkout.js";


export async function getOrder(userId: string, orderId: string){
    const order = await prisma.order.findFirst({
        where: { userId, id: orderId },
        include: { orderItems: {
            include: { product: true }
        } },
    });

    if(!order) throw new HttpError(404, "La orden no existe.");
    
    return order;
};

export async function cancelOrder(userId: string, orderId: string){
    const order = await getOrder(userId, orderId);

    if(order.status === "CANCELLED") return order;
    if(order.status === "PAID") throw new HttpError(409, "La orden ya fue pagada y no se puede cancelar");

    const closedOrder = await closePendingOrder(order);

    if (closedOrder.status === "PAID") throw new HttpError(409, "La orden ya fue pagada y no se puede cancelar");

    return closedOrder;
};

export async function listOrders(userId: string){
    const orderList = await prisma.order.findMany({
        where: { userId },
        include: {orderItems: true },
        orderBy: { createdAt: "desc"}
    });

    return orderList;
}