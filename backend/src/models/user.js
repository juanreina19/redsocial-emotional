const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    bio: {
        type: String,
        default: "",
        maxlength: 160,
    },
    avatar: {
        type: String,
        default: "",
    },
    mood: {
        type: String,
        enum: ["feliz", "triste", "neutral", "enojado"],
        default: "neutral",
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
