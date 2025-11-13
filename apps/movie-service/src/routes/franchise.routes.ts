import { Router } from "express";
import {
  getAllFranchises,
  getFranchiseBySlugOrId,
  createFranchise,
  updateFranchise,
  deleteFranchise,
} from "../controllers/franchise.controller.js";

const router: Router = Router();

router.get("/", getAllFranchises);
router.get("/:slugOrId", getFranchiseBySlugOrId);
router.post("/", createFranchise);
router.put("/:slugOrId", updateFranchise);
router.delete("/:slugOrId", deleteFranchise);

export default router;
