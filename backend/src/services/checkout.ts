import { randomUUID } from "node:crypto";
import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { MIN_CHECKOUT_AMOUNT, stripe } from "../lib/stripe.js";
import { getCart } from "./cart.js";
import { env } from "../lib/env.js";


export async function createCheckout(userId: string){
    
    const userCart = await getCart(userId);
    const activeItems = userCart.items.filter((i) => i.product.active);

    if(activeItems.length === 0) throw new HttpError(400, "No hay productos disponibles para comprar");
    if(userCart.total < MIN_CHECKOUT_AMOUNT) throw new HttpError(400, "El mínimo de compra es 0,50 USD");
    
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

    // await prisma.order.update({
    //     where: { userId },
    //     data: { status: "CANCELLED" }
    // })

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

    // el [] es para que sea el primero, me quedo con la orden updateada.
    const [paidOrder] = await prisma.$transaction([
        prisma.order.update({ where: { id: order.id } , data: { status: "PAID" }, include: { orderItems: true } }),
        prisma.cartItem.deleteMany({ where: { userId, productId: { in: productIdList } } })
    ]);

    return paidOrder;
}