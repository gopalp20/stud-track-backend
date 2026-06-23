const validateSubject = (req, res, next) => {

    const {
        subjectName,
        subjectCode,
        credits,
        grade
    } = req.body;

    if (
        !subjectName ||
        !subjectCode ||
        credits == null ||
        !grade
    ) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    }

    if (credits <= 0) {

        return res.status(400).json({
            success: false,
            message: "Credits must be greater than 0"
        });

    }

    const validGrades = [
        "S",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F"
    ];

    if (!validGrades.includes(grade)) {

        return res.status(400).json({
            success: false,
            message: "Invalid Grade"
        });

    }

    next();

};

module.exports = validateSubject;