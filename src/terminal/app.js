const readline = require("readline");

const {
    calculateFinalGrade,
    getEquivalentGrade,
    getStatus,
    validateGrade
} = require("../services/gradeCalculator");

const {
    addStudent,
    getAllStudents,
    findStudent
} = require("../services/studentService");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer.trim());
        });
    });
}

async function askGrade(question) {
    while (true) {
        const input = await ask(question);
        const value = Number(input);

        if (validateGrade(value)) {
            return value;
        }

        console.log(
            "Invalid grade. Please enter a number from 0 to 100."
        );
    }
}

async function addStudentMenu() {
    console.log("\n========== ADD STUDENT ==========\n");

    const id = await ask("Student ID: ");
    const name = await ask("Student Name: ");
    const subject = await ask("Subject: ");

    const quiz = await askGrade("Quiz Grade: ");
    const assignments = await askGrade("Assignment Grade: ");
    const project = await askGrade("Project Grade: ");
    const midterm = await askGrade("Midterm Grade: ");
    const finalExam = await askGrade("Final Exam Grade: ");

    const grades = {
        quiz,
        assignments,
        project,
        midterm,
        finalExam
    };

    try {
        addStudent(id, name, subject, grades);

        console.log("\nStudent successfully added.");
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function calculateStudentMenu() {
    console.log("\n========== CALCULATE GRADE ==========\n");

    const id = await ask("Enter Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    try {
        const finalGrade = calculateFinalGrade(student.grades);
        const equivalent = getEquivalentGrade(finalGrade);
        const status = getStatus(finalGrade);

        console.log("\n====================================");
        console.log("           GRADE RESULT");
        console.log("====================================");
        console.log(`Student:       ${student.name}`);
        console.log(`Student ID:    ${student.id}`);
        console.log(`Subject:       ${student.subject}`);
        console.log("------------------------------------");
        console.log(`Quiz:          ${student.grades.quiz}`);
        console.log(`Assignments:   ${student.grades.assignments}`);
        console.log(`Project:       ${student.grades.project}`);
        console.log(`Midterm:       ${student.grades.midterm}`);
        console.log(`Final Exam:    ${student.grades.finalExam}`);
        console.log("------------------------------------");
        console.log(`Final Grade:   ${finalGrade.toFixed(2)}`);
        console.log(`Equivalent:    ${equivalent}`);
        console.log(`Status:        ${status}`);
        console.log("====================================");
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewStudentsMenu() {
    const students = getAllStudents();

    console.log("\n========== STUDENT RECORDS ==========\n");

    if (students.length === 0) {
        console.log("No student records found.");
        return;
    }

    students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.id} - ${student.name}`);
        console.log(`   Subject: ${student.subject}`);
        console.log("");
    });
}

async function searchStudentMenu() {
    console.log("\n========== SEARCH STUDENT ==========\n");

    const id = await ask("Enter Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    console.log("\nStudent found:");
    console.log(`ID:      ${student.id}`);
    console.log(`Name:    ${student.name}`);
    console.log(`Subject: ${student.subject}`);
}

async function mainMenu() {
    while (true) {
        console.log(`
========================================
             GRADECALC
       Student Grade Calculator
========================================

1. Add Student
2. Calculate Grade
3. View Student Records
4. Search Student
5. Exit

========================================
`);

        const choice = await ask("Enter choice: ");

        switch (choice) {
            case "1":
                await addStudentMenu();
                break;

            case "2":
                await calculateStudentMenu();
                break;

            case "3":
                await viewStudentsMenu();
                break;

            case "4":
                await searchStudentMenu();
                break;

            case "5":
                console.log("\nThank you for using GradeCalc.");
                rl.close();
                return;

            default:
                console.log("\nInvalid choice. Please try again.");
        }
    }
}

mainMenu();