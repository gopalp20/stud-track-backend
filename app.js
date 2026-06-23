
const express = require("express");
const cors = require("cors");

const app = express();

// Built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/semester", require("./routes/semesterRoutes"));
app.use("/api/subject", require("./routes/subjectRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Default Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Student Academic Tracker API Running"
    });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// Error Middleware (Always Last)
const errorMiddleware = require("./middlewares/errorMiddleware");
app.use(errorMiddleware);

module.exports = app;
