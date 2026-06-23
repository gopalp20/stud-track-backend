const validateSemester = (req, res, next) => {

    const { semesterNumber } = req.body;

    if (!semesterNumber) {

        return res.status(400).json({
            success: false,
            message: "Semester Number is required"
        });

    }

    if (semesterNumber < 1 || semesterNumber > 8) {

        return res.status(400).json({
            success: false,
            message: "Semester must be between 1 and 8"
        });

    }

    next();

};

module.exports = validateSemester;