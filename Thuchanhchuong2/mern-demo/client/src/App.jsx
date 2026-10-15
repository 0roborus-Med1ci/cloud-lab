
import { useEffect, useState } from "react";
import "./App.css";

async function apiRequest(path, options = {}) {
    const baseURL = import.meta.env.VITE_API_URL || "";
    const response = await fetch(`${baseURL}${path}`, options);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Request failed");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function App() {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editingId, setEditingId] = useState(null);

    const fetchStudents = async () => {
        try {
            const data = await apiRequest("/api/students");
            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error getting students:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const resetForm = () => {
        setStudentId("");
        setName("");
        setEmail("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const studentData = {
            studentId,
            name,
            email
        };

        try {
            if (editingId) {
                await apiRequest(`/api/students/${editingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                });
            } else {
                await apiRequest("/api/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                });
            }

            resetForm();
            await fetchStudents();
        } catch (error) {
            console.error("Error saving student:", error);
            alert("Không thể lưu sinh viên. Vui lòng kiểm tra backend.");
        }
    };

    const handleEdit = (student) => {
        setEditingId(student._id);
        setStudentId(student.studentId);
        setName(student.name);
        setEmail(student.email);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sinh viên này?")) {
            return;
        }

        try {
            await apiRequest(`/api/students/${id}`, {
                method: "DELETE"
            });

            await fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Không thể xóa sinh viên.");
        }
    };

    return (
        <div className="container">
            <h1>Student Management v2.0</h1>

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
                        onClick={resetForm}
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
                                <button
                                    type="button"
                                    onClick={() => handleEdit(student)}
                                >
                                    Sửa
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(student._id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}

                    {students.length === 0 && (
                        <tr>
                            <td colSpan="4">
                                Chưa có dữ liệu sinh viên.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default App;
