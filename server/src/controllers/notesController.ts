import type { Request, Response } from 'express'; // Use the standard Request
import Note from '../models/Notes.js';
import User from '../models/User.js';
import type { AuthRequest } from '../middlewares/authMiddleware.js'; // We still need this for casting

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    // ✅ THE FIX: Cast `req` to `AuthRequest` here
    const userId = (req as AuthRequest).user?.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are mandatory.' });
    }

    const newNote = new Note({
      title,
      content,
      user: userId,
    });

    const savedNote = await newNote.save();
    await User.findByIdAndUpdate(userId, { $push: { notes: savedNote._id } });
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get all notes for a logged-in user
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req: Request, res: Response) => {
  try {
    // ✅ THE FIX: Cast `req` to `AuthRequest` here
    const userId = (req as AuthRequest).user?.id;
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error)
  {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req: Request, res: Response) => {
  try {
    // ✅ THE FIX: Cast `req` to `AuthRequest` here
    const userId = (req as AuthRequest).user?.id;
    const noteId = req.params.id;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }
    
    // Make sure the note belongs to the user trying to delete it
    if (note.user.toString() !== userId) {
      return res.status(401).json({ message: 'Not authorized to delete this note.' });
    }

    await Note.findByIdAndDelete(noteId);
    await User.findByIdAndUpdate(userId, { $pull: { notes: noteId } });
    res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};