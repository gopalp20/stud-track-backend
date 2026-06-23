const express = require("express");

const router = express.Router();

const {
    addSubject,
    getSubjectsBySemester,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const authMiddleware = require("../middlewares/authMiddleware");
const validateSubject = require("../middlewares/validateSubject");

router.post(
    "/:semesterId",
    authMiddleware,
    validateSubject,
    addSubject
);

router.get(
    "/:semesterId",
    authMiddleware,
    getSubjectsBySemester
);

router.put(
    "/:id",
    authMiddleware,
    validateSubject,
    updateSubject
);

router.delete(
    "/:id",
    authMiddleware,
    deleteSubject
);

module.exports = router;
