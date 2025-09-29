import { Router } from "express";
import { protect, AuthRequest } from "../middlewares/authMiddleware.js";
import * as notesController from "../controllers/notesController.js";

const router = Router();

// Cast controllers to RequestHandler so TS stops complaining
router.post("/create", protect as any, notesController.createNote as any);
router.post("/view", protect  as any,  notesController.viewNotes as any);
router.delete("/delete/:id", protect  as any, notesController.deleteNote as any);

export default router;