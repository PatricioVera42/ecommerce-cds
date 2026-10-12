import express from "express";
import cors from "cors";
import {env} from "./lib/env.js";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./routes/auth.js";
import { productsRouter } from "./routes/products.js";
import path from "node:path";

const app = express();
const PORT = env.PORT;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/health", (_req, res) => {
    res.json({ ok: true});
});

app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});