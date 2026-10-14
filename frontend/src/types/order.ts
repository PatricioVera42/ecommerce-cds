
export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

export type OrderItem = {
    productId: string;
    quantity: number;
    unitPrice: number;
};

export type Order = {
    id: string;
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
    orderItems: OrderItem[];
};
