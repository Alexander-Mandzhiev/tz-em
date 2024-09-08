import { Router } from "express";
import OrdersController from "../controllers/orders.controller.js"
const router = new Router()

router.post("/order", OrdersController.create)
router.get("/order", OrdersController.getAll)
router.get("/order/:id", OrdersController.getOne)
router.put("/order/:id", OrdersController.update)
router.delete("/order/:id", OrdersController.delete)

export default router; 