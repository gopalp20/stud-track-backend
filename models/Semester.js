const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        semesterNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 8
        },

        gpa: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Semester", semesterSchema);