import { Router } from "express";
import historyController from "../constrollers/history.controller.js"
const router = new Router()

router.get("/history", historyController.getAll)

export default router; 