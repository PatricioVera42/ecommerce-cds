import { Router } from "express";
import { createCheckout } from "../services/checkout.js";

export const checkoutRouter = Router();


checkoutRouter.post("/", async (req, res) => {
    const result = await createCheckout(req.user!.id);
    res.status(200).json(result);
})