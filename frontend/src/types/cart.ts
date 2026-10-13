import type { Product } from "./product";

export type CartItem = {
    productId: string;
    quantity: number;
    product: Product;
    subtotal: number;
};

export type Cart = {
    items: CartItem[];
    total: number;
};
