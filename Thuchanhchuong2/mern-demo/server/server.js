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
// Seed dữ liệu mặc định
// =========================
const seedStudents = async () => {
    try {
        const count = await Student.countDocuments();
        
        // Nếu database đã có dữ liệu, không seed lại
        if (count > 0) {
            console.log("Database already has students, skipping seed.");
            return;
        }

        const defaultStudents = [
            {
                studentId: "SV001",
                name: "Nguyễn Văn A",
                email: "nguyenvana@example.com"
            },
            {
                studentId: "SV002",
                name: "Trần Thị B",
                email: "tranthib@example.com"
            },
            {
                studentId: "SV003",
                name: "Lê Văn C",
                email: "levanc@example.com"
            },
            {
                studentId: "SV004",
                name: "Phạm Thị D",
                email: "phamthid@example.com"
            },
            {
                studentId: "SV005",
                name: "Vũ Văn E",
                email: "vuvane@example.com"
            }
        ];

        await Student.insertMany(defaultStudents);
        console.log("✓ Database seeded with default students");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// =========================
// MongoDB + Server
// =========================
mongoose
    .connect(MONGODB_URI)
    .then(async () => {
        console.log("MongoDB Atlas connected successfully!");

        // Seed dữ liệu nếu cần
        await seedStudents();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });