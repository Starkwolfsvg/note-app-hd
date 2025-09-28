

import { Router } from 'express';
import { createNote, deleteNote, getNotes } from '../controllers/notesController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);
router.route('/')
  .post(createNote)
  .get(getNotes);

router.route('/:id')
  .delete(deleteNote);

export default router;
