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

    const existingStudent = students.find(student => student.id === id);

    if (existingStudent) {
        throw new Error("A student with this ID already exists.");
    }

    const student = new Student(id, name, subject, grades);

    students.push(student);
    saveStudents(students);

    return student;
}

function getAllStudents() {
    return loadStudents();
}

function findStudent(id) {
    const students = loadStudents();

    return students.find(student => student.id === id);
}

module.exports = {
    loadStudents,
    saveStudents,
    addStudent,
    getAllStudents,
    findStudent
};