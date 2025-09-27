import { Schema, model, Document} from 'mongoose';

// Interface to define the User document structure for TypeScript
export interface IUser extends Document {
    name: string;
    email: string;
    dateOfBirth: Date;
    password?: string; // might be google users
    googleId?: string;  
    notes: Schema.Types.ObjectId[];
}
const userSchema  = new Schema<IUser>({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    dateOfBirth:{
        type: Date,
        required: true,
    },
    password:{
        type:String,
        required: false,// google users
    },
    googleId:{
        type: String,
        required: false,
    },
    notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note', // refers to notes model
  }],
},{ timestamps: true});

export default model<IUser>('User', userSchema);
