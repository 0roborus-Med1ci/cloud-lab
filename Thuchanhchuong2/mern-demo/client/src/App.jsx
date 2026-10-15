import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    major: "",
  });

  const getId = (student) => student._id || student.id;

  const loadStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Không thể tải danh sách sinh viên.");

      const data = await response.json();
      setStudents(Array.isArray(data) ? data : data.students || []);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const resetForm = () => {
    setForm({ name: "", email: "", age: "", major: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const openEdit = (student) => {
    setEditingId(getId(student));
    setForm({
      name: student.name || "",
      email: student.email || "",
      age: student.age ?? "",
      major: student.major || student.department || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const isEditing = editingId !== null;
    const url = isEditing
      ? `${API_URL}/${editingId}`
      : API_URL;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: form.age === "" ? "" : Number(form.age),
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể lưu sinh viên. Vui lòng kiểm tra API.");
      }

      resetForm();
      await loadStudents();
    } catch (err) {
      setError(err.message || "Không thể lưu dữ liệu.");
    }
  };

  const handleDelete = async (student) => {
    const id = getId(student);

    if (!id) {
      setError("Không tìm thấy ID sinh viên để xóa.");
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn xóa ${student.name || "sinh viên này"}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Không thể xóa sinh viên.");

      await loadStudents();
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi xóa.");
    }
  };

  const filteredStudents = students.filter((student) => {
    const keyword = search.trim().toLowerCase();
    return [
      student.name,
      student.email,
      student.major,
      student.department,
      student.studentId,
      student.mssv,
    ].some((value) => String(value || "").toLowerCase().includes(keyword));
  });

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Trang chủ">
          <span className="brand-icon">S</span>
          <span>Student<span className="brand-light">Space</span></span>
        </a>
        <span className="topbar-label">HỆ THỐNG QUẢN LÝ SINH VIÊN</span>
      </header>

      <section className="page-content">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">QUẢN LÝ ĐÀO TẠO</p>
            <h1>Danh sách sinh viên</h1>
            <p className="subtitle">
              Quản lý thông tin sinh viên của bạn một cách đơn giản và hiệu quả.
            </p>
          </div>
          <div className="welcome-decoration" aria-hidden="true">✳</div>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <span>{error}</span>
            <button onClick={() => setError("")} aria-label="Đóng thông báo">×</button>
          </div>
        )}

        <section className="student-card">
          <div className="card-heading">
            <div>
              <h2>Thông tin sinh viên</h2>
              <p>Danh sách hồ sơ hiện có trong hệ thống</p>
            </div>
            <button className="primary-button" onClick={() => {
              resetForm();
              setShowForm(true);
            }}>
              <span>＋</span> Thêm sinh viên
            </button>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Tìm theo tên, email, ngành học..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Tìm kiếm sinh viên"
              />
            </label>
            <span className="student-count">
              Tổng cộng <strong>{filteredStudents.length}</strong> sinh viên
            </span>
          </div>

          {showForm && (
            <form className="student-form" onSubmit={handleSubmit}>
              <div className="form-heading">
                <h3>{editingId !== null ? "Cập nhật sinh viên" : "Thêm sinh viên mới"}</h3>
                <button type="button" className="close-button" onClick={resetForm}>×</button>
              </div>

              <div className="form-grid">
                <label>
                  Họ và tên *
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn An"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </label>
                <label>
                  Tuổi
                  <input
                    type="number"
                    min="1"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="20"
                  />
                </label>
                <label>
                  Ngành học
                  <input
                    value={form.major}
                    onChange={(e) => setForm({ ...form, major: e.target.value })}
                    placeholder="Công nghệ thông tin"
                  />
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={resetForm}>
                  Hủy
                </button>
                <button type="submit" className="primary-button">
                  {editingId !== null ? "Lưu thay đổi" : "Lưu sinh viên"}
                </button>
              </div>
            </form>
          )}

          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th className="number-col">STT</th>
                  <th>SINH VIÊN</th>
                  <th>EMAIL</th>
                  <th>TUỔI</th>
                  <th>NGÀNH HỌC</th>
                  <th className="action-col">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <span className="loading-dot" /> Đang tải danh sách sinh viên...
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <span className="empty-icon">♧</span>
                      <strong>{search ? "Không tìm thấy sinh viên" : "Chưa có sinh viên nào"}</strong>
                      <span>
                        {search
                          ? "Thử tìm kiếm với từ khóa khác."
                          : "Thêm hồ sơ đầu tiên để bắt đầu quản lý."}
                      </span>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={getId(student) || index}>
                      <td className="number-col">{String(index + 1).padStart(2, "0")}</td>
                      <td>
                        <div className="student-identity">
                          <span className="avatar">
                            {(student.name || "?").trim().charAt(0).toUpperCase()}
                          </span>
                          <span className="student-name">{student.name || "Chưa cập nhật"}</span>
                        </div>
                      </td>
                      <td className="email-cell">{student.email || "—"}</td>
                      <td>{student.age ?? "—"}</td>
                      <td>
                        <span className="major-tag">
                          {student.major || student.department || "Chưa cập nhật"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => openEdit(student)}
                            aria-label={`Sửa ${student.name || "sinh viên"}`}
                          >
                            Sửa
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(student)}
                            aria-label={`Xóa ${student.name || "sinh viên"}`}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="table-footer">
            <span>Hiển thị {filteredStudents.length} / {students.length} hồ sơ</span>
            <span className="footer-status"><span /> Hệ thống quản lý sinh viên</span>
          </footer>
        </section>

        <p className="page-footer">Một không gian gọn gàng cho hành trình học tập tốt hơn.</p>
      </section>
    </main>
  );
}

export default App;