import type { Product } from "./product";

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    PENDING: "Pendiente",
    PAID: "Pagada",
    CANCELLED: "Cancelada",
}

export type OrderItem = {
    productId: string;
    quantity: number;
    unitPrice: number;
    productName: string;
};

export type Order = {
    id: string;
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
    orderItems: OrderItem[];
};

export type OrderItemDetail = OrderItem & { product : Product};

export type OrderDetail = Omit<Order, "orderItems"> & { orderItems: OrderItemDetail[] };