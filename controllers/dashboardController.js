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

const calculateGPA = (subjects) => {
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

    return {
        gpa,
        totalCredits,
        totalGradePoints
    };
};

// Get Dashboard
const getDashboard = async (req, res) => {
    try {

        const semesters = await Semester.find({
            student: req.user._id
        }).sort({ semesterNumber: 1 });

        const subjects = await Subject.find({
            student: req.user._id
        });

        let totalCredits = 0;
        let totalGradePoints = 0;
        let totalCreditsEarned = 0;

        const semesterWiseGPA = [];
        const gpaTrendData = [];

        for (const semester of semesters) {
            const semesterSubjects = subjects.filter(
                (subject) => subject.semester.toString() === semester._id.toString()
            );

            const result = calculateGPA(semesterSubjects);

            totalCredits += result.totalCredits;
            totalGradePoints += result.totalGradePoints;

            const earnedCredits = semesterSubjects.reduce(
                (sum, subject) => subject.grade === "F"
                    ? sum
                    : sum + subject.credits,
                0
            );

            totalCreditsEarned += earnedCredits;

            if (semester.gpa !== result.gpa) {
                semester.gpa = result.gpa;
                await semester.save();
            }

            semesterWiseGPA.push({
                semesterId: semester._id,
                semesterNumber: semester.semesterNumber,
                gpa: result.gpa,
                totalCredits: result.totalCredits,
                creditsEarned: earnedCredits
            });

            gpaTrendData.push({
                semester: semester.semesterNumber,
                gpa: result.gpa
            });
        }

        const currentCGPA = totalCredits === 0
            ? 0
            : Number((totalGradePoints / totalCredits).toFixed(2));

        res.status(200).json({
            success: true,
            dashboard: {
                totalCreditsEarned,
                currentCGPA,
                semesterWiseGPA,
                gpaTrendData,
                totalSemesters: semesters.length,
                totalSubjects: subjects.length
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
    getDashboard
};
