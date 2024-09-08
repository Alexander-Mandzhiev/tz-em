import { Router } from "express";
import ShopsController from "../controllers/shops.controller.js"
const router = new Router()

router.post("/shop", ShopsController.create)
router.get("/shop", ShopsController.getAll)
router.get("/shop/:id", ShopsController.getOne)
router.put("/shop/:id", ShopsController.update)
router.delete("/shop/:id", ShopsController.delete)

export default router; 