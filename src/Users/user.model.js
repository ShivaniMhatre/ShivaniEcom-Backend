import { model, Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    profileImage: {
        type: String
    },
    bio: {
        type: String,
        maxlength: 200
    },
    profession: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const User = new model('User', userSchema);
export default User

