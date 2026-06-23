const Student = require("../models/Student");
const Semester = require("../models/Semester");

const getCurrentSemester = async (studentId) => {
    const latestSemester = await Semester.findOne({
        student: studentId
    }).sort({ semesterNumber: -1 });

    return latestSemester ? latestSemester.semesterNumber : 1;
};

// GET Profile
const getProfile = async (req, res) => {
    try {

        const student = await Student.findById(req.user._id).select("-password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const currentSemester = await getCurrentSemester(req.user._id);

        res.status(200).json({
            success: true,
            student: {
                ...student.toObject(),
                currentSemester
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// UPDATE Profile
const updateProfile = async (req, res) => {
    try {

        const { name, branch } = req.body;

        const student = await Student.findById(req.user._id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (name) student.name = name;
        if (branch) student.branch = branch;

        student.currentSemester = await getCurrentSemester(req.user._id);

        await student.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                registrationNumber: student.registrationNumber,
                branch: student.branch,
                currentSemester: student.currentSemester
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
    getProfile,
    updateProfile
};
