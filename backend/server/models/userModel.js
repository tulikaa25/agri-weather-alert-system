// userModel.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        default: ""
    },
    // Add the new language field here
    language: {
        type: String,
        enum: ['english', 'hindi'],
        default: 'english' // Set a default language
    }
});

const User = mongoose.model('User', UserSchema);
export default User;