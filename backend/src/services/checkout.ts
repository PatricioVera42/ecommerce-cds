import { randomUUID } from "node:crypto";
import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { MIN_CHECKOUT_AMOUNT, stripe } from "../lib/stripe.js";
import { getCart } from "./cart.js";
import { env } from "../lib/env.js";


async function markOrderPaid(orderId: string, userId: string, productIds: string[]) {
    const [paidOrder] = await prisma.$transaction([
        prisma.order.update({ where: { id: orderId }, data: { status: "PAID" }, include: { orderItems: true } }),
        prisma.cartItem.deleteMany({ where: { userId, productId: { in: productIds } } }),
    ]);
    return paidOrder;
};

export async function closePendingOrder(order: {id: string, userId: string, stripeSessionId: string, orderItems: { productId: string }[] }) {
    const oldSession = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
    if(oldSession.payment_status === "paid"){                
        // este if es por si no se llega a confirmar el checkout y la orden queda como PENDING en la bdd pero el pago en Stripe se hizo
        return await markOrderPaid(order.id, order.userId, order.orderItems.map((i) => i.productId));
    } else if (oldSession.status === "open"){
        await stripe.checkout.sessions.expire(order.stripeSessionId);
    }; 
    return await prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" }, include: { orderItems: true } });
}


export async function createCheckout(userId: string){
    
    const userCart = await getCart(userId);
    const activeItems = userCart.items.filter((i) => i.product.active);

    if(activeItems.length === 0) throw new HttpError(400, "No hay productos disponibles para comprar");
    if(userCart.total < MIN_CHECKOUT_AMOUNT) throw new HttpError(400, "El mínimo de compra es 0,50 USD");
    
    const pendingOrders = await prisma.order.findMany({
        where: { userId, status: "PENDING" },
        include: { orderItems: true },
    });

    for (const order of pendingOrders){
        const closed = await closePendingOrder(order);
        if(closed.status === "PAID") throw new HttpError(409, "Tu compra anterior ya estaba pagada. Revisá tu carrito.");
    }

    const orderId = randomUUID();

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: activeItems.map((i) => ({
            price_data: {
                currency: "usd",
                unit_amount: i.product.price,
                product_data: { name: i.product.name },
            },
            quantity: i.quantity,
        })),
        success_url: `${env.FRONTEND_URL}/checkout/exito?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.FRONTEND_URL}/checkout/cancelado?order_id=${orderId}`,
    });


    await prisma.order.create({
        data: {
            id: orderId,
            userId,
            stripeSessionId: session.id, 
            totalPrice: userCart.total,
            orderItems: { create: activeItems.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
                unitPrice: i.product.price,
                productName : i.product.name,
            }))},
        },
    });

    return { url: session.url };
};


export async function confirmCheckout(userId: string, sessionId: string) {
    
    const order = await prisma.order.findFirst({
        where: { userId, stripeSessionId: sessionId},
        include: { orderItems: true }
    });

    if (!order) throw new HttpError(404, "Orden no existente");
    
    if(order.status === "PAID") return order;
    if(order.status === "CANCELLED") throw new HttpError(400, "La orden fue cancelada");

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if(session.payment_status !== "paid") throw new HttpError(400, "La orden no ha sido pagada");

    const productIdList = order.orderItems.map((i) => i.productId);


    return markOrderPaid(order.id, userId, productIdList);
}

