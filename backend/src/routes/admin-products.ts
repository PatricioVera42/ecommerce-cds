import { Router } from "express";
import { createProduct, getProductById, listAllProducts, updateProduct } from "../services/admin-products.js";
import { createProductBody, updateProductBody } from "../schemas/product.js";


export const adminProductsRouter = Router();

adminProductsRouter.get("/", async (_req, res) => {
    const result = await listAllProducts();
    res.status(200).json(result);
});

adminProductsRouter.get("/:id", async (req, res) => {
    const result = await getProductById(req.params.id);
    res.status(200).json(result);
});

adminProductsRouter.post("/", async (req, res) => {
    const data = createProductBody.parse(req.body);
    const result = await createProduct(data);
    res.status(201).json(result);
});

adminProductsRouter.patch("/:id", async (req, res) => {
    const data = updateProductBody.parse(req.body);
    const result = await updateProduct(req.params.id, data);
    res.status(200).json(result);
});
