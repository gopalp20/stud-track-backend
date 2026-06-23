const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            registrationNumber,
            branch,
            currentSemester
        } = req.body;

        // Check email
        const emailExists = await Student.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Check registration number
        const regExists = await Student.findOne({
            registrationNumber
        });

        if (regExists) {
            return res.status(400).json({
                success: false,
                message: "Registration number already exists"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name,
            email,
            password: hashedPassword,
            registrationNumber,
            branch,
            currentSemester
        });

        const token = jwt.sign(
            {
                id: student._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            success: true,
            token,
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

// Login
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                id: student._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            token,
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
    signup,
    login
};
