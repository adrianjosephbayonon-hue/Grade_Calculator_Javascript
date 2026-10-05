const readline = require("readline");

const {
    calculateFinalGrade,
    calculateBreakdown,
    getEquivalentGrade,
    getStatus,
    validateGrade
} = require("../services/gradeCalculator");

const {
    addStudent,
    getAllStudents,
    findStudent,
    updateStudent,
    deleteStudent
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

async function calculateStudentMenu() {
    console.log("\n========== GRADE REPORT ==========\n");

    const id = await ask("Enter Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    try {
        const finalGrade = calculateFinalGrade(student.grades);
        const breakdown = calculateBreakdown(student.grades);
        const equivalent = getEquivalentGrade(finalGrade);
        const status = getStatus(finalGrade);

        console.log("\n==============================================");
        console.log("              GRADE REPORT");
        console.log("==============================================");
        console.log(`Student:       ${student.name}`);
        console.log(`Student ID:    ${student.id}`);
        console.log(`Subject:       ${student.subject}`);
        console.log("----------------------------------------------");

        console.log(
            `Quiz:          ${breakdown.quiz.grade.toFixed(2)}`
        );
        console.log(
            `Weight:        ${(breakdown.quiz.weight * 100).toFixed(0)}%`
        );
        console.log(
            `Contribution:  ${breakdown.quiz.contribution.toFixed(2)}`
        );

        console.log("----------------------------------------------");

        console.log(
            `Assignments:   ${breakdown.assignments.grade.toFixed(2)}`
        );
        console.log(
            `Weight:        ${(breakdown.assignments.weight * 100).toFixed(0)}%`
        );
        console.log(
            `Contribution:  ${breakdown.assignments.contribution.toFixed(2)}`
        );

        console.log("----------------------------------------------");

        console.log(
            `Project:       ${breakdown.project.grade.toFixed(2)}`
        );
        console.log(
            `Weight:        ${(breakdown.project.weight * 100).toFixed(0)}%`
        );
        console.log(
            `Contribution:  ${breakdown.project.contribution.toFixed(2)}`
        );

        console.log("----------------------------------------------");

        console.log(
            `Midterm:       ${breakdown.midterm.grade.toFixed(2)}`
        );
        console.log(
            `Weight:        ${(breakdown.midterm.weight * 100).toFixed(0)}%`
        );
        console.log(
            `Contribution:  ${breakdown.midterm.contribution.toFixed(2)}`
        );

        console.log("----------------------------------------------");

        console.log(
            `Final Exam:    ${breakdown.finalExam.grade.toFixed(2)}`
        );
        console.log(
            `Weight:        ${(breakdown.finalExam.weight * 100).toFixed(0)}%`
        );
        console.log(
            `Contribution:  ${breakdown.finalExam.contribution.toFixed(2)}`
        );

        console.log("==============================================");
        console.log(`Final Grade:    ${finalGrade.toFixed(2)}`);
        console.log(`Equivalent:     ${equivalent}`);
        console.log(`Status:         ${status}`);
        console.log("==============================================");
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

async function updateStudentMenu() {
    console.log("\n========== UPDATE STUDENT ==========\n");

    const id = await ask("Enter Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    console.log("\nCurrent Student Information:");
    console.log(`Name:    ${student.name}`);
    console.log(`Subject: ${student.subject}`);

    console.log("\nEnter new information:");

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
        updateStudent(
            id,
            name,
            subject,
            grades
        );

        console.log("\nStudent successfully updated.");
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function deleteStudentMenu() {
    console.log("\n========== DELETE STUDENT ==========\n");

    const id = await ask("Enter Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    console.log("\nStudent to be deleted:");
    console.log(`ID:      ${student.id}`);
    console.log(`Name:    ${student.name}`);
    console.log(`Subject: ${student.subject}`);

    const confirmation = await ask(
        "\nAre you sure you want to delete this student? (Y/N): "
    );

    if (confirmation.toLowerCase() !== "y") {
        console.log("\nDelete operation cancelled.");
        return;
    }

    try {
        deleteStudent(id);

        console.log("\nStudent successfully deleted.");
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
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
5. Update Student
6. Delete Student
7. Exit

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
                await updateStudentMenu();
                break;

            case "6":
                await deleteStudentMenu();
                break;

            case "7":
                console.log("\nThank you for using GradeCalc.");
                rl.close();
                return;

            default:
                console.log("\nInvalid choice. Please try again.");
        }
    }
}

mainMenu();