import { Router } from "express";
import { cancelOrder } from "../services/orders.js";


export const ordersRouter = Router(); 

ordersRouter.post("/:id/cancel", async (req, res) => {
    const result = await cancelOrder(req.user!.id, req.params.id);
    res.status(200).json(result)
})