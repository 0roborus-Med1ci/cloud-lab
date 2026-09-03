const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// =========================
// GET /api/hello
// =========================
app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend is running successfully!"
    });
});

// =========================
// CÂU 36 - GET students
// =========================
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Error getting students",
            error: error.message
        });
    }
});

// =========================
// CÂU 37 - POST student
// =========================
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({
            message: "Error creating student",
            error: error.message
        });
    }
});

// =========================
// CÂU 38 - PUT student
// =========================
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({
            message: "Error updating student",
            error: error.message
        });
    }
});

// =========================
// CÂU 39 - DELETE student
// =========================
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Error deleting student",
            error: error.message
        });
    }
});

// =========================
// MongoDB + Server
// =========================
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });