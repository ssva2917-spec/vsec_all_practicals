
import { useState } from "react";
import "./App.css";

const subjects = [
  "Mathematics",
  "Computer Networks",
  "DBMS",
  "React"
];

const emptyForm = {
  name: "",
  rollNo: "",
  department: "",
  marks: ["", "", "", ""]
};

function StudentForm({ onSaveStudent, editingStudent, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);

  // Fill the form when an existing student is selected for editing.
  function loadStudent(student) {
    if (student) {
      setForm({
        name: student.name,
        rollNo: student.rollNo,
        department: student.department,
        marks: student.marks.map(String)
      });
    } else {
      setForm({ ...emptyForm, marks: ["", "", "", ""] });
    }
  }

  // Update the form whenever the selected student changes.
  // The key below is used by the parent to reset the form on edit/cancel.
  const [loadedId, setLoadedId] = useState(null);

  if (editingStudent && loadedId !== editingStudent.id) {
    loadStudent(editingStudent);
    setLoadedId(editingStudent.id);
  }

  if (!editingStudent && loadedId !== null) {
    loadStudent(null);
    setLoadedId(null);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleMarksChange(index, value) {
    setForm((previous) => {
      const updatedMarks = [...previous.marks];
      updatedMarks[index] = value;
      return { ...previous, marks: updatedMarks };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const marks = form.marks.map(Number);
    const total = marks.reduce((sum, mark) => sum + mark, 0);

    onSaveStudent({
      id: editingStudent ? editingStudent.id : Date.now(),
      name: form.name.trim(),
      rollNo: form.rollNo.trim(),
      department: form.department,
      marks,
      total,
      percentage: total / subjects.length,
      result: marks.every((mark) => mark >= 35) ? "Pass" : "Fail"
    });

    setForm({ ...emptyForm, marks: ["", "", "", ""] });
    setLoadedId(null);
  }

  function cancelEdit() {
    setForm({ ...emptyForm, marks: ["", "", "", ""] });
    setLoadedId(null);
    onCancelEdit();
  }

  return (
    <section className="panel" id="student-form">
      <div className="panel-heading">
        <span className="eyebrow">
          {editingStudent ? "EDIT RECORD" : "NEW RECORD"}
        </span>
        <h2>{editingStudent ? "Update Student Result" : "Add Student Result"}</h2>
        <p>
          {editingStudent
            ? "Change the details or marks and save your updates."
            : "Enter student details and marks for each subject."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Student Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="rollNo">Roll Number</label>
            <input
              id="rollNo"
              name="rollNo"
              value={form.rollNo}
              onChange={handleChange}
              placeholder="e.g. 101"
              required
            />
          </div>
        </div>

        <div className="field form-spaced">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select department</option>
            <option>Information Technology</option>
            <option>Computer Engineering</option>
            <option>Mechanical Engineering</option>
            <option>Electrical Engineering</option>
            <option>Civil Engineering</option>
          </select>
        </div>

        <h3 className="marks-heading">
          Subject Marks <span>/ 100 each</span>
        </h3>

        <div className="marks-grid">
          {subjects.map((subject, index) => (
            <div className="field" key={subject}>
              <label htmlFor={`subject-${index}`}>{subject}</label>
              <input
                id={`subject-${index}`}
                type="number"
                min="0"
                max="100"
                value={form.marks[index]}
                onChange={(event) =>
                  handleMarksChange(index, event.target.value)
                }
                placeholder="0–100"
                required
              />
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button className="primary-btn" type="submit">
            {editingStudent ? "Save Changes" : "+ Add Student Result"}
          </button>

          {editingStudent && (
            <button
              className="cancel-btn"
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function StudentTable({ students, onDelete, onEdit }) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No student results yet</h3>
        <p>Fill in the form above to add your first student.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No.</th>
            <th>Department</th>
            {subjects.map((subject) => (
              <th key={subject}>{subject}</th>
            ))}
            <th>Total</th>
            <th>Percentage</th>
            <th>Result</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="student-name">{student.name}</td>
              <td>{student.rollNo}</td>
              <td>{student.department}</td>
              {student.marks.map((mark, index) => (
                <td key={index}>{mark}</td>
              ))}
              <td><strong>{student.total}/400</strong></td>
              <td>{student.percentage.toFixed(2)}%</td>
              <td>
                <span className={`result-badge ${student.result.toLowerCase()}`}>
                  {student.result}
                </span>
              </td>
              <td>
                <div className="row-actions">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => onEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => onDelete(student.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  function saveStudent(student) {
    if (editingStudent) {
      setStudents((previous) =>
        previous.map((item) =>
          item.id === student.id ? student : item
        )
      );
      setEditingStudent(null);
    } else {
      setStudents((previous) => [...previous, student]);
    }
  }

  function deleteStudent(id) {
    setStudents((previous) =>
      previous.filter((student) => student.id !== id)
    );

    if (editingStudent?.id === id) {
      setEditingStudent(null);
    }
  }

  function editStudent(student) {
    setEditingStudent(student);
    document.getElementById("student-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  const topper = students.length
    ? students.reduce((best, student) =>
        student.percentage > best.percentage ? student : best
      )
    : null;

  const average = students.length
    ? students.reduce((sum, student) => sum + student.percentage, 0) /
      students.length
    : 0;

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand-mark">SR</div>
        <div className="brand-text">
          <h1>Scholar<span>Track</span></h1>
          <p>STUDENT RESULT MANAGEMENT</p>
        </div>
        <div className="header-tag">REACT PRACTICAL</div>
      </header>

      <main className="container">
        <section className="hero">
          <span className="eyebrow">ACADEMIC DASHBOARD</span>
          <h2>Student Results, <span>all in one place.</span></h2>
          <p>
            Add, edit and manage student records, calculate percentages,
            and identify the class topper automatically.
          </p>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Students</span>
            <strong>{students.length}</strong>
            <small>Records entered</small>
          </div>
          <div className="stat-card">
            <span>Class Average</span>
            <strong>{average.toFixed(2)}%</strong>
            <small>Across all students</small>
          </div>
          <div className="stat-card">
            <span>Class Topper</span>
            <strong className="topper-name">{topper ? topper.name : "—"}</strong>
            <small>
              {topper ? `${topper.percentage.toFixed(2)}% score` : "No results yet"}
            </small>
          </div>
          <div className="stat-card">
            <span>Students Passed</span>
            <strong>{students.filter((s) => s.result === "Pass").length}</strong>
            <small>At least 35 in every subject</small>
          </div>
        </section>

        <StudentForm
          onSaveStudent={saveStudent}
          editingStudent={editingStudent}
          onCancelEdit={() => setEditingStudent(null)}
        />

        <section className="panel results-panel">
          <div className="results-heading">
            <div>
              <span className="eyebrow">CLASS RECORDS</span>
              <h2>All Student Results</h2>
              <p>Use Edit to update a record without adding a duplicate.</p>
            </div>
            <span className="count-badge">{students.length} students</span>
          </div>

          <StudentTable
            students={students}
            onDelete={deleteStudent}
            onEdit={editStudent}
          />
        </section>

        <footer>
          <span>ScholarTrack · Student Result Management</span>
          <span>Built with React components</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
