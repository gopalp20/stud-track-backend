const express = require("express");

const router = express.Router();

const {
    addSemester,
    getSemesters,
    getSemester,
    updateSemester,
    deleteSemester
} = require("../controllers/semesterController");

const authMiddleware = require("../middlewares/authMiddleware");
const validateSemester = require("../middlewares/validateSemester");

router.post(
    "/",
    authMiddleware,
    validateSemester,
    addSemester
);

router.get(
    "/",
    authMiddleware,
    getSemesters
);

router.get(
    "/:id",
    authMiddleware,
    getSemester
);

router.put(
    "/:id",
    authMiddleware,
    validateSemester,
    updateSemester
);

router.delete(
    "/:id",
    authMiddleware,
    deleteSemester
);

module.exports = router;