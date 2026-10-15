
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Student = require("./models/Student");

const app = express();

// =========================
// CẤU HÌNH CORS LINH HOẠT
// =========================

const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://mern-frontend-236248.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
}));

app.use(express.json());

// =========================
// CẤU HÌNH SERVER
// =========================

const PORT = Number(process.env.PORT) || 5000;
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
// GET /api/students
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
// POST /api/students
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
// PUT /api/students/:id
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
// DELETE /api/students/:id
// =========================
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

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
// SEED DỮ LIỆU MẶC ĐỊNH
// =========================
const seedStudents = async () => {
    try {
        const count = await Student.countDocuments();

        if (count > 0) {
            console.log(
                "Database already has students, skipping seed."
            );
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

        console.log("Database seeded with default students");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// =========================
// KẾT NỐI MONGODB + KHỞI ĐỘNG SERVER
// =========================
if (!MONGODB_URI) {
    console.error("MONGODB_URI is not configured!");
    process.exit(1);
}

mongoose
    .connect(MONGODB_URI)
    .then(async () => {
        console.log(
            `MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`
        );

        await seedStudents();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    });
