import express from "express";
import cors from "cors";
import {env} from "./lib/env.js";

const app = express();
const PORT = env.PORT;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ ok: true});
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});