const mongoose = require("mongoose");

const gitRemoteSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 64,
        },
        url: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2048,
        },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must contain at least 2 characters"],
        maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
        match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",],
    },
    password:{
        type: String,
        required: [true, "password is required"],
        minlength: [6, "Password must contain at least 6 characters"],
        select: false,
    },
    gitRemote: {
        type: gitRemoteSchema,
        default: null,
    },

},
{
    timestamps: true,
    versionKey: false,
}

);

module.exports = mongoose.model("User", userSchema);