import { Router } from "express";
import * as z from "zod";
import { getProduct, listProducts } from "../services/products.js";


export const productsRouter = Router();

const listQuery = z.object({
    search: z.string().optional()
});

productsRouter.get("/", async (req, res) => {
    const data = listQuery.parse(req.query);
    const result = await listProducts(data.search);
    res.status(200).json(result);
});

productsRouter.get("/:id", async (req, res) => {
    const result = await getProduct(req.params.id);
    res.status(200).json(result);
});