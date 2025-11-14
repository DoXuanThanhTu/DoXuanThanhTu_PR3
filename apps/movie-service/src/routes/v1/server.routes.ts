import { Router } from "express";
import * as ServerController from "../../controllers/v1/server.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/role.middleware.js";

const router: Router = Router();

// GET /servers?page=&limit=&movie_id=
router.get("/", ServerController.getServers);

// GET /servers/:id
router.get("/:id", ServerController.getServerById);

// GET /servers/movie/:movieId
router.get("/movie/:movieId", ServerController.getServersByMovie);

// POST /servers
router.post("/", authMiddleware, isAdmin, ServerController.createServer);

// PUT /servers/:id
router.put("/:id", authMiddleware, isAdmin, ServerController.updateServer);

// DELETE /servers/:id
router.delete("/:id", authMiddleware, isAdmin, ServerController.deleteServer);

export default router;
