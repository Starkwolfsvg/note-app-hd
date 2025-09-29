// controllers/notesController.ts
import { Response } from "express";
import Note ,{ INote } from "../models/Notes.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

// Create note
export const createNote = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

 const { notedata, completed } = req.body;
  const note: INote = await Note.create({
    title: notedata,
    content: notedata,
    completed: completed || false,
    user: req.user.id,
  });

  return res.status(201).json({
    id: note._id.toString(),      // ✅ now TS knows _id exists
    notedata: note.content,
    completed: note.completed,
  });
};

// View notes
export const viewNotes = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const notes: INote[] = await Note.find({ user: req.user.id });

  // convert ObjectId to string for frontend
  const formattedNotes = notes.map((note) => ({
    id: note._id.toString(),
    notedata: note.content,
    completed: note.completed,
  }));

  return res.json({ data: formattedNotes });
};

// Delete note
export const deleteNote = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });

  // ensure note belongs to user
  if (note.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await note.deleteOne();

  return res.json({ message: "Note deleted successfully", id: note._id.toString() });
};