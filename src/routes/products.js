import express from "express";
import { productContainer } from "../server.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
	const productos = await productContainer.productos;
	res.send(productos);
});

productRouter.post("/", async (req, res) => {
	const newProduct = req.body;
	const result = await productContainer.addProduct(newProduct);
	res.send(result);
});

export { productRouter };
