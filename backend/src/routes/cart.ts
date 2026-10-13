import { Router } from "express";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../services/cart.js";
import { addCartItemBody, updateCartItemBody } from "../schemas/cart.js";


export const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
    const result = await getCart(req.user!.id);
    res.status(200).json(result);
});

cartRouter.post("/items", async (req, res) => {
    const data =  addCartItemBody.parse(req.body);
    const result = await addCartItem(req.user!.id, data.productId, data.quantity);
    res.status(200).json(result);
});

cartRouter.patch("/items/:productId", async (req, res) => {
    const data  = updateCartItemBody.parse(req.body);
    const result = await updateCartItem(req.user!.id, req.params.productId, data.quantity);
    res.status(200).json(result);
});

cartRouter.delete("/items/:productId", async (req, res) => {
    const result = await removeCartItem(req.user!.id, req.params.productId)
    res.status(200).json(result);
});
