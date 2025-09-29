import { Schema, model, Document, Types } from "mongoose";

export interface INote extends Document {
  _id: Types.ObjectId;       // explicitly declare _id
  title: string;
  content: string;
  completed: boolean;
  user: Types.ObjectId;
}

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<INote>("Note", noteSchema);