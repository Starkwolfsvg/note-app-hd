import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import * as notesController from "../controllers/notesController.js";
const router = Router();
// Cast controllers to RequestHandler so TS stops complaining
router.post("/create", protect, notesController.createNote);
router.post("/view", protect, notesController.viewNotes);
router.delete("/delete/:id", protect, notesController.deleteNote);
export default router;
