import { Router, type Request } from "express";
import { createProduct, getProductById, listAllProducts, setProductImage, updateProduct } from "../services/admin-products.js";
import { createProductBody, updateProductBody } from "../schemas/product.js";
import { upload } from "../lib/upload.js";
import { HttpError } from "../lib/http-error.js";


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


adminProductsRouter.post("/:id/image", upload.single("image"), async (req: Request <{ id: string }>, res) => {
    
    if(!req.file) throw new HttpError(400, "Falta la imagen");

    const result = await setProductImage(req.params.id, req.file.filename);
    res.status(200).json(result);
})
