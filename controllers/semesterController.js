const Semester = require("../models/Semester");
const Subject = require("../models/Subject");

// Add Semester
const addSemester = async (req, res) => {
    try {

        const { semesterNumber } = req.body;

        // Check if semester already exists
        const existingSemester = await Semester.findOne({
            student: req.user._id,
            semesterNumber
        });

        if (existingSemester) {
            return res.status(400).json({
                success: false,
                message: "Semester already exists"
            });
        }

        const semester = await Semester.create({
            student: req.user._id,
            semesterNumber,
            gpa: 0
        });

        res.status(201).json({
            success: true,
            message: "Semester added successfully",
            semester
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Get All Semesters
const getSemesters = async (req, res) => {
    try {

        const semesters = await Semester.find({
            student: req.user._id
        }).sort({ semesterNumber: 1 });

        res.status(200).json({
            success: true,
            count: semesters.length,
            semesters
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Get Single Semester
const getSemester = async (req, res) => {
    try {

        const semester = await Semester.findOne({
            _id: req.params.id,
            student: req.user._id
        });

        if (!semester) {
            return res.status(404).json({
                success: false,
                message: "Semester not found"
            });
        }

        res.status(200).json({
            success: true,
            semester
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Update Semester
const updateSemester = async (req, res) => {
    try {

        const { semesterNumber } = req.body;

        const semester = await Semester.findOne({
            _id: req.params.id,
            student: req.user._id
        });

        if (!semester) {
            return res.status(404).json({
                success: false,
                message: "Semester not found"
            });
        }

        // Prevent duplicate semester numbers
        const duplicate = await Semester.findOne({
            student: req.user._id,
            semesterNumber,
            _id: { $ne: req.params.id }
        });

        if (duplicate) {
            return res.status(400).json({
                success: false,
                message: "Semester number already exists"
            });
        }

        semester.semesterNumber = semesterNumber;

        await semester.save();

        res.status(200).json({
            success: true,
            message: "Semester updated successfully",
            semester
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Delete Semester
const deleteSemester = async (req, res) => {
    try {

        const semester = await Semester.findOne({
            _id: req.params.id,
            student: req.user._id
        });

        if (!semester) {
            return res.status(404).json({
                success: false,
                message: "Semester not found"
            });
        }

        await Subject.deleteMany({
            semester: req.params.id,
            student: req.user._id
        });

        await Semester.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Semester deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
    addSemester,
    getSemesters,
    getSemester,
    updateSemester,
    deleteSemester
};
