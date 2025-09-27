import { Schema, model, Document } from 'mongoose';

// Interface for the Note document
export interface INote extends Document {
  title: string;
  content: string;
  user: Schema.Types.ObjectId; // Reference to the user who created it
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
}, {
  timestamps: true
});

export default model<INote>('Note', noteSchema);