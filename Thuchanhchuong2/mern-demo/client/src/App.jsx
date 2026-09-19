import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editingId, setEditingId] = useState(null);

    // GET students
    const fetchStudents = async () => {
        try {
           const response = await fetch("http://localhost:5000/api/students");
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // POST / PUT
    const handleSubmit = async (e) => {
        e.preventDefault();

        const studentData = {
            studentId,
            name,
            email
        };

        try {
            if (editingId) {
                // PUT
                await fetch(`/api/students/${editingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                });
            } else {
                // POST
                await fetch("/api/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                });
            }

            setStudentId("");
            setName("");
            setEmail("");
            setEditingId(null);

            fetchStudents();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Edit
    const handleEdit = (student) => {
        setEditingId(student._id);
        setStudentId(student.studentId);
        setName(student.name);
        setEmail(student.email);
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
            return;
        }

        try {
            await fetch(`/api/students/${id}`, {
                method: "DELETE"
            });

            fetchStudents();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container">
            <h1>Student Management</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="MSSV"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit">
                    {editingId ? "Cập nhật" : "Thêm sinh viên"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setStudentId("");
                            setName("");
                            setEmail("");
                        }}
                    >
                        Hủy
                    </button>
                )}
            </form>

            <h2>Danh sách sinh viên</h2>

            <table>
                <thead>
                    <tr>
                        <th>MSSV</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {students.map((student) => (
                        <tr key={student._id}>
                            <td>{student.studentId}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>
                                <button onClick={() => handleEdit(student)}>
                                    Sửa
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(student._id)
                                    }
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;