const Semester = require("../models/Semester");
const Subject = require("../models/Subject");

const gradePoints = {
    S: 10,
    A: 9,
    B: 8,
    C: 7,
    D: 6,
    E: 5,
    F: 0
};

const calculateSemesterGPA = async (semesterId, studentId) => {
    const subjects = await Subject.find({
        semester: semesterId,
        student: studentId
    });

    const totalCredits = subjects.reduce(
        (sum, subject) => sum + subject.credits,
        0
    );

    const totalGradePoints = subjects.reduce(
        (sum, subject) => sum + subject.credits * gradePoints[subject.grade],
        0
    );

    const gpa = totalCredits === 0
        ? 0
        : Number((totalGradePoints / totalCredits).toFixed(2));

    await Semester.findOneAndUpdate(
        {
            _id: semesterId,
            student: studentId
        },
        {
            gpa
        }
    );

    return gpa;
};

// Add Subject
const addSubject = async (req, res) => {
    try {

        const { semesterId } = req.params;
        const {
            subjectName,
            subjectCode,
            credits,
            grade
        } = req.body;

        const semester = await Semester.findOne({
            _id: semesterId,
            student: req.user._id
        });

        if (!semester) {
            return res.status(404).json({
                success: false,
                message: "Semester not found"
            });
        }

        const duplicateSubject = await Subject.findOne({
            student: req.user._id,
            semester: semesterId,
            subjectCode
        });

        if (duplicateSubject) {
            return res.status(400).json({
                success: false,
                message: "Subject code already exists in this semester"
            });
        }

        const subject = await Subject.create({
            student: req.user._id,
            semester: semesterId,
            subjectName,
            subjectCode,
            credits,
            grade
        });

        const gpa = await calculateSemesterGPA(semesterId, req.user._id);

        res.status(201).json({
            success: true,
            message: "Subject added successfully",
            subject,
            gpa
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Get Subjects By Semester
const getSubjectsBySemester = async (req, res) => {
    try {

        const { semesterId } = req.params;

        const semester = await Semester.findOne({
            _id: semesterId,
            student: req.user._id
        });

        if (!semester) {
            return res.status(404).json({
                success: false,
                message: "Semester not found"
            });
        }

        const subjects = await Subject.find({
            semester: semesterId,
            student: req.user._id
        }).sort({ subjectCode: 1 });

        res.status(200).json({
            success: true,
            count: subjects.length,
            subjects
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Update Subject
const updateSubject = async (req, res) => {
    try {

        const {
            subjectName,
            subjectCode,
            credits,
            grade
        } = req.body;

        const subject = await Subject.findOne({
            _id: req.params.id,
            student: req.user._id
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        const duplicateSubject = await Subject.findOne({
            _id: { $ne: req.params.id },
            student: req.user._id,
            semester: subject.semester,
            subjectCode
        });

        if (duplicateSubject) {
            return res.status(400).json({
                success: false,
                message: "Subject code already exists in this semester"
            });
        }

        subject.subjectName = subjectName;
        subject.subjectCode = subjectCode;
        subject.credits = credits;
        subject.grade = grade;

        await subject.save();

        const gpa = await calculateSemesterGPA(subject.semester, req.user._id);

        res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            subject,
            gpa
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Delete Subject
const deleteSubject = async (req, res) => {
    try {

        const subject = await Subject.findOne({
            _id: req.params.id,
            student: req.user._id
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        const semesterId = subject.semester;

        await Subject.findByIdAndDelete(req.params.id);

        const gpa = await calculateSemesterGPA(semesterId, req.user._id);

        res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
            gpa
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
    addSubject,
    getSubjectsBySemester,
    updateSubject,
    deleteSubject
};
