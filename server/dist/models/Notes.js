import { Schema, model } from "mongoose";
const noteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
export default model("Note", noteSchema);
