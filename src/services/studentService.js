const fs = require("fs");
const path = require("path");
const Student = require("../models/Student");

const DATA_FILE = path.join(__dirname, "../../data/students.json");

function loadStudents() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");

        if (!data.trim()) {
            return [];
        }

        const students = JSON.parse(data);

        return students.map(student => {
            // Convert old format:
            // student.subject + student.grades
            // into:
            // student.subjects = [{ subject, grades }]

            if (!student.subjects) {
                return {
                    id: student.id,
                    name: student.name,
                    subjects: [
                        {
                            subject: student.subject,
                            grades: student.grades
                        }
                    ]
                };
            }

            return student;
        });
    } catch (error) {
        return [];
    }
}

function saveStudents(students) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(students, null, 4),
        "utf8"
    );
}

function addStudent(id, name) {
    const students = loadStudents();

    const existingStudent = students.find(
        student => student.id === id
    );

    if (existingStudent) {
        throw new Error("A student with this ID already exists.");
    }

    const student = new Student(id, name);

    students.push(student);
    saveStudents(students);

    return student;
}

function getAllStudents() {
    return loadStudents();
}

function findStudent(id) {
    const students = loadStudents();

    return students.find(
        student => student.id === id
    );
}

function addSubject(id, subject, grades) {
    const students = loadStudents();

    const student = students.find(
        student => student.id === id
    );

    if (!student) {
        throw new Error("Student not found.");
    }

    const existingSubject = student.subjects.find(
        item => item.subject.toLowerCase() === subject.toLowerCase()
    );

    if (existingSubject) {
        throw new Error(
            "This student already has this subject."
        );
    }

    student.subjects.push({
        subject,
        grades
    });

    saveStudents(students);

    return student;
}

function updateSubject(id, subject, grades) {
    const students = loadStudents();

    const student = students.find(
        student => student.id === id
    );

    if (!student) {
        throw new Error("Student not found.");
    }

    const subjectRecord = student.subjects.find(
        item => item.subject.toLowerCase() === subject.toLowerCase()
    );

    if (!subjectRecord) {
        throw new Error("Subject not found.");
    }

    subjectRecord.grades = grades;

    saveStudents(students);

    return student;
}

function deleteSubject(id, subject) {
    const students = loadStudents();

    const student = students.find(
        student => student.id === id
    );

    if (!student) {
        throw new Error("Student not found.");
    }

    const index = student.subjects.findIndex(
        item => item.subject.toLowerCase() === subject.toLowerCase()
    );

    if (index === -1) {
        throw new Error("Subject not found.");
    }

    student.subjects.splice(index, 1);

    saveStudents(students);

    return student;
}

function updateStudent(id, name) {
    const students = loadStudents();

    const student = students.find(
        student => student.id === id
    );

    if (!student) {
        throw new Error("Student not found.");
    }

    student.name = name;

    saveStudents(students);

    return student;
}

function deleteStudent(id) {
    const students = loadStudents();

    const index = students.findIndex(
        student => student.id === id
    );

    if (index === -1) {
        throw new Error("Student not found.");
    }

    const deletedStudent = students[index];

    students.splice(index, 1);

    saveStudents(students);

    return deletedStudent;
}

module.exports = {
    loadStudents,
    saveStudents,
    addStudent,
    getAllStudents,
    findStudent,
    addSubject,
    updateSubject,
    deleteSubject,
    updateStudent,
    deleteStudent
};