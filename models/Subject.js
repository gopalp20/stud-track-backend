const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        semester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Semester",
            required: true
        },

        subjectName: {
            type: String,
            required: true,
            trim: true
        },

        subjectCode: {
            type: String,
            required: true,
            uppercase: true,
            trim: true
        },

        credits: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },

        grade: {
            type: String,
            required: true,
            enum: ["S", "A", "B", "C", "D", "E", "F"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Subject", subjectSchema);