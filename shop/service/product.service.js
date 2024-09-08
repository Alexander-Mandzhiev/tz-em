import { Router } from "express";
import ProductController from "../controllers/product.controller.js"
const router = new Router()

router.post("/product", ProductController.create)
router.get("/product", ProductController.getAll)
router.get("/product/:plu", ProductController.getOne)
router.put("/product/:plu", ProductController.update)
router.delete("/product/:plu", ProductController.delete)

export default router; 