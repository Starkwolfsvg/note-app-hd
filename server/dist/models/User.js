import { Schema, model } from 'mongoose';
const userSchema = new Schema({
    name: {
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    googleId: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        required: false,
    },
    otpExpires: {
        type: Date,
        required: false,
    },
    notes: [{
            type: Schema.Types.ObjectId,
            ref: 'Note', // refers to notes model
        }],
}, { timestamps: true });
export default model('User', userSchema);
