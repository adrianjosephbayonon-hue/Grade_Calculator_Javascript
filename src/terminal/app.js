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
    addSubject,
    updateSubject,
    deleteSubject,
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

async function collectGrades() {
    const quiz = await askGrade("Quiz Grade: ");
    const assignments = await askGrade("Assignment Grade: ");
    const project = await askGrade("Project Grade: ");
    const midterm = await askGrade("Midterm Grade: ");
    const finalExam = await askGrade("Final Exam Grade: ");

    return {
        quiz,
        assignments,
        project,
        midterm,
        finalExam
    };
}

async function addStudentMenu() {
    console.log("\n========== ADD STUDENT ==========\n");

    const id = await ask("Student ID: ");
    const name = await ask("Student Name: ");

    try {
        addStudent(id, name);

        console.log("\nStudent successfully added.");

        const addFirstSubject = await ask(
            "Add a subject now? (Y/N): "
        );

        if (addFirstSubject.toLowerCase() === "y") {
            await addSubjectMenu(id);
        }
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function addSubjectMenu(studentId = null) {
    console.log("\n========== ADD SUBJECT ==========\n");

    const id = studentId || await ask("Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    const subject = await ask("Subject: ");

    const grades = await collectGrades();

    try {
        addSubject(id, subject, grades);

        console.log("\nSubject successfully added.");
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function calculateStudentMenu() {
    console.log("\n========== GRADE REPORT ==========\n");

    const id = await ask("Enter Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    if (student.subjects.length === 0) {
        console.log("\nThis student has no subjects.");
        return;
    }

    console.log("\nSubjects:");

    student.subjects.forEach((item, index) => {
        console.log(`${index + 1}. ${item.subject}`);
    });

    const subjectNumber = Number(
        await ask("\nSelect subject: ")
    );

    if (
        Number.isNaN(subjectNumber) ||
        subjectNumber < 1 ||
        subjectNumber > student.subjects.length
    ) {
        console.log("\nInvalid subject selection.");
        return;
    }

    const selectedSubject =
        student.subjects[subjectNumber - 1];

    try {
        const finalGrade = calculateFinalGrade(
            selectedSubject.grades
        );

        const breakdown = calculateBreakdown(
            selectedSubject.grades
        );

        const equivalent =
            getEquivalentGrade(finalGrade);

        const status =
            getStatus(finalGrade);

        console.log("\n==============================================");
        console.log("              GRADE REPORT");
        console.log("==============================================");
        console.log(`Student:       ${student.name}`);
        console.log(`Student ID:    ${student.id}`);
        console.log(`Subject:       ${selectedSubject.subject}`);
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

        if (student.subjects.length === 0) {
            console.log("   Subjects: None");
        } else {
            console.log("   Subjects:");

            student.subjects.forEach(item => {
                console.log(`      - ${item.subject}`);
            });
        }

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
    console.log(`ID:   ${student.id}`);
    console.log(`Name: ${student.name}`);

    console.log("\nSubjects:");

    if (student.subjects.length === 0) {
        console.log("None");
    } else {
        student.subjects.forEach((item, index) => {
            console.log(
                `${index + 1}. ${item.subject}`
            );
        });
    }
}

async function updateStudentMenu() {
    console.log("\n========== UPDATE STUDENT ==========\n");

    const id = await ask("Enter Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    console.log("\nCurrent Information:");
    console.log(`Name: ${student.name}`);

    const name = await ask(
        "\nEnter new student name: "
    );

    try {
        updateStudent(id, name);

        console.log(
            "\nStudent information successfully updated."
        );
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function updateSubjectMenu() {
    console.log("\n========== UPDATE SUBJECT ==========\n");

    const id = await ask("Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    if (student.subjects.length === 0) {
        console.log("\nThis student has no subjects.");
        return;
    }

    student.subjects.forEach((item, index) => {
        console.log(
            `${index + 1}. ${item.subject}`
        );
    });

    const subjectNumber = Number(
        await ask("\nSelect subject: ")
    );

    if (
        Number.isNaN(subjectNumber) ||
        subjectNumber < 1 ||
        subjectNumber > student.subjects.length
    ) {
        console.log("\nInvalid subject selection.");
        return;
    }

    const selectedSubject =
        student.subjects[subjectNumber - 1];

    console.log(
        `\nUpdating: ${selectedSubject.subject}`
    );

    const grades = await collectGrades();

    try {
        updateSubject(
            id,
            selectedSubject.subject,
            grades
        );

        console.log(
            "\nSubject grades successfully updated."
        );
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function deleteSubjectMenu() {
    console.log("\n========== DELETE SUBJECT ==========\n");

    const id = await ask("Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    if (student.subjects.length === 0) {
        console.log("\nThis student has no subjects.");
        return;
    }

    student.subjects.forEach((item, index) => {
        console.log(
            `${index + 1}. ${item.subject}`
        );
    });

    const subjectNumber = Number(
        await ask("\nSelect subject: ")
    );

    if (
        Number.isNaN(subjectNumber) ||
        subjectNumber < 1 ||
        subjectNumber > student.subjects.length
    ) {
        console.log("\nInvalid subject selection.");
        return;
    }

    const selectedSubject =
        student.subjects[subjectNumber - 1];

    const confirmation = await ask(
        `Delete ${selectedSubject.subject}? (Y/N): `
    );

    if (confirmation.toLowerCase() !== "y") {
        console.log("\nDelete operation cancelled.");
        return;
    }

    try {
        deleteSubject(
            id,
            selectedSubject.subject
        );

        console.log(
            "\nSubject successfully deleted."
        );
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

    console.log("\nSubjects:");

    student.subjects.forEach(item => {
        console.log(`- ${item.subject}`);
    });

    const confirmation = await ask(
        "\nAre you sure you want to delete this student? (Y/N): "
    );

    if (confirmation.toLowerCase() !== "y") {
        console.log("\nDelete operation cancelled.");
        return;
    }

    try {
        deleteStudent(id);

        console.log(
            "\nStudent successfully deleted."
        );
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function academicSummaryMenu() {
    console.log("\n========== ACADEMIC SUMMARY ==========\n");

    const id = await ask("Enter Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    if (student.subjects.length === 0) {
        console.log("\nThis student has no subjects.");
        return;
    }

    let totalGrade = 0;

    console.log("\n==============================================");
    console.log("              ACADEMIC SUMMARY");
    console.log("==============================================");
    console.log(`Student:       ${student.name}`);
    console.log(`Student ID:    ${student.id}`);
    console.log("----------------------------------------------");
    console.log(
        "Subject                         Final Grade"
    );
    console.log("----------------------------------------------");

    student.subjects.forEach(item => {
        const finalGrade = calculateFinalGrade(
            item.grades
        );

        totalGrade += finalGrade;

        const subjectName = item.subject.padEnd(30, " ");

        console.log(
            `${subjectName}${finalGrade.toFixed(2)}`
        );
    });

    const overallAverage =
        totalGrade / student.subjects.length;

    const equivalent =
        getEquivalentGrade(overallAverage);

    const status =
        getStatus(overallAverage);

    console.log("----------------------------------------------");
    console.log(
        `Overall Average: ${overallAverage.toFixed(2)}`
    );
    console.log(
        `Overall Equivalent: ${equivalent}`
    );
    console.log(
        `Overall Status:     ${status}`
    );
    console.log("==============================================");
}


async function mainMenu() {
    while (true) {
        console.log(`
========================================
             GRADECALC
       Student Grade Calculator
========================================

1. Add Student
2. Add Subject
3. Calculate Grade
4. View Student Records
5. Search Student
6. Academic Summary
7. Update Student
8. Update Subject Grades
9. Delete Subject
10. Delete Student
11. Exit

========================================
`);

        const choice = await ask("Enter choice: ");

        switch (choice) {
    case "1":
        await addStudentMenu();
        break;

    case "2":
        await addSubjectMenu();
        break;

    case "3":
        await calculateStudentMenu();
        break;

    case "4":
        await viewStudentsMenu();
        break;

    case "5":
        await searchStudentMenu();
        break;

    case "6":
        await academicSummaryMenu();
        break;

    case "7":
        await updateStudentMenu();
        break;

    case "8":
        await updateSubjectMenu();
        break;

    case "9":
        await deleteSubjectMenu();
        break;

    case "10":
        await deleteStudentMenu();
        break;

    case "11":
        console.log(
            "\nThank you for using GradeCalc."
        );

        rl.close();
        return;

    default:
        console.log(
            "\nInvalid choice. Please try again."
        );
}
    }
}

mainMenu();