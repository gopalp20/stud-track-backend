const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        branch: {
            type: String,
            required: true,
            trim: true
        },

        currentSemester: {
            type: Number,
            default: 1,
            min: 1,
            max: 8
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);