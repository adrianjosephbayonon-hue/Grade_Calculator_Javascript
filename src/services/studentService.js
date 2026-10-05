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

        return JSON.parse(data);
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

function addStudent(id, name, subject, grades) {
    const students = loadStudents();

    const existingStudent = students.find(
        student => student.id === id
    );

    if (existingStudent) {
        throw new Error("A student with this ID already exists.");
    }

    const student = new Student(
        id,
        name,
        subject,
        grades
    );

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

function updateStudent(id, name, subject, grades) {
    const students = loadStudents();

    const index = students.findIndex(
        student => student.id === id
    );

    if (index === -1) {
        throw new Error("Student not found.");
    }

    students[index].name = name;
    students[index].subject = subject;
    students[index].grades = grades;

    saveStudents(students);

    return students[index];
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
    updateStudent,
    deleteStudent
};