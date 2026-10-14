import { Router } from "express";
import { confirmCheckout, createCheckout } from "../services/checkout.js";
import { confirmCheckoutBody } from "../schemas/checkout.js";

export const checkoutRouter = Router();


checkoutRouter.post("/", async (req, res) => {
    const result = await createCheckout(req.user!.id);
    res.status(200).json(result);
});

checkoutRouter.post("/confirm", async (req, res) => {
    const data = confirmCheckoutBody.parse(req.body);
    const result = await confirmCheckout(req.user!.id, data.sessionId);
    res.status(200).json(result);
})