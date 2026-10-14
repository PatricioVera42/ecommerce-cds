import { Router } from "express";
import { cancelOrder, getOrder, listOrders } from "../services/orders.js";


export const ordersRouter = Router(); 

ordersRouter.post("/:id/cancel", async (req, res) => {
    const result = await cancelOrder(req.user!.id, req.params.id);
    res.status(200).json(result)
});

ordersRouter.get("/", async (req, res) => {
    const result = await listOrders(req.user!.id);
    res.status(200).json(result); 
});

ordersRouter.get("/:id", async (req, res) => {
    const result = await getOrder(req.user!.id, req.params.id);
    res.status(200).json(result);
})

