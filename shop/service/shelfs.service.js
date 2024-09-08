import { Router } from "express";
import ShelfsController from "../controllers/shelfs.controller.js"
const router = new Router()

router.post("/shelfs", ShelfsController.create)
router.get("/shelfs/:products_plu/:shops_id", ShelfsController.getOne)
router.put("/shelfs/:products_plu/:shops_id", ShelfsController.update)
router.put("/shelfs/inc/:products_plu/:shops_id", ShelfsController.increase)
router.put("/shelfs/dec/:products_plu/:shops_id", ShelfsController.decrease)
router.delete("/shelfs/:products_plu/:shops_id", ShelfsController.delete)

export default router; 