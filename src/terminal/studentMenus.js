const {
    addStudent,
    getAllStudents,
    findStudent,
    addSubject,
    updateStudent,
    updateSubject,
    deleteSubject,
    deleteStudent
} = require("../services/studentService");

const {
    validateGrade
} = require("../services/gradeCalculator");

async function askGrade(ask, question) {
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

async function collectGrades(ask) {
    const quiz = await askGrade(
        ask,
        "Quiz Grade: "
    );

    const assignments = await askGrade(
        ask,
        "Assignment Grade: "
    );

    const project = await askGrade(
        ask,
        "Project Grade: "
    );

    const midterm = await askGrade(
        ask,
        "Midterm Grade: "
    );

    const finalExam = await askGrade(
        ask,
        "Final Exam Grade: "
    );

    return {
        quiz,
        assignments,
        project,
        midterm,
        finalExam
    };
}

async function addStudentMenu(ask) {
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
            await addSubjectMenu(ask, id);
        }
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function addSubjectMenu(ask, studentId = null) {
    console.log("\n========== ADD SUBJECT ==========\n");

    const id =
        studentId ||
        await ask("Student ID: ");

    const student = findStudent(id);

    if (!student) {
        console.log("\nStudent not found.");
        return;
    }

    const subject = await ask("Subject: ");

    const grades = await collectGrades(ask);

    try {
        addSubject(
            id,
            subject,
            grades
        );

        console.log(
            "\nSubject successfully added."
        );
    } catch (error) {
        console.log(`\nError: ${error.message}`);
    }
}

async function viewStudentsMenu() {
    const students = getAllStudents();

    console.log(
        "\n========== STUDENT RECORDS ==========\n"
    );

    if (students.length === 0) {
        console.log(
            "No student records found."
        );

        return;
    }

    students.forEach((student, index) => {
        console.log(
            `${index + 1}. ${student.id} - ${student.name}`
        );

        if (student.subjects.length === 0) {
            console.log("   Subjects: None");
        } else {
            console.log("   Subjects:");

            student.subjects.forEach(item => {
                console.log(
                    `      - ${item.subject}`
                );
            });
        }

        console.log("");
    });
}

async function searchStudentMenu(ask) {
    console.log(
        "\n========== SEARCH STUDENT ==========\n"
    );

    const id = await ask(
        "Enter Student ID: "
    );

    const student = findStudent(id);

    if (!student) {
        console.log(
            "\nStudent not found."
        );

        return;
    }

    console.log("\nStudent found:");
    console.log(`ID:   ${student.id}`);
    console.log(`Name: ${student.name}`);

    console.log("\nSubjects:");

    if (student.subjects.length === 0) {
        console.log("None");
    } else {
        student.subjects.forEach(
            (item, index) => {
                console.log(
                    `${index + 1}. ${item.subject}`
                );
            }
        );
    }
}

async function updateStudentMenu(ask) {
    console.log(
        "\n========== UPDATE STUDENT ==========\n"
    );

    const id = await ask(
        "Enter Student ID: "
    );

    const student = findStudent(id);

    if (!student) {
        console.log(
            "\nStudent not found."
        );

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

async function updateSubjectMenu(ask) {
    console.log(
        "\n========== UPDATE SUBJECT ==========\n"
    );

    const id = await ask(
        "Student ID: "
    );

    const student = findStudent(id);

    if (!student) {
        console.log(
            "\nStudent not found."
        );

        return;
    }

    if (student.subjects.length === 0) {
        console.log(
            "\nThis student has no subjects."
        );

        return;
    }

    student.subjects.forEach(
        (item, index) => {
            console.log(
                `${index + 1}. ${item.subject}`
            );
        }
    );

    const subjectNumber = Number(
        await ask("\nSelect subject: ")
    );

    if (
        Number.isNaN(subjectNumber) ||
        subjectNumber < 1 ||
        subjectNumber > student.subjects.length
    ) {
        console.log(
            "\nInvalid subject selection."
        );

        return;
    }

    const selectedSubject =
        student.subjects[subjectNumber - 1];

    console.log(
        `\nUpdating: ${selectedSubject.subject}`
    );

    const grades = await collectGrades(ask);

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

async function deleteSubjectMenu(ask) {
    console.log(
        "\n========== DELETE SUBJECT ==========\n"
    );

    const id = await ask(
        "Student ID: "
    );

    const student = findStudent(id);

    if (!student) {
        console.log(
            "\nStudent not found."
        );

        return;
    }

    if (student.subjects.length === 0) {
        console.log(
            "\nThis student has no subjects."
        );

        return;
    }

    student.subjects.forEach(
        (item, index) => {
            console.log(
                `${index + 1}. ${item.subject}`
            );
        }
    );

    const subjectNumber = Number(
        await ask("\nSelect subject: ")
    );

    if (
        Number.isNaN(subjectNumber) ||
        subjectNumber < 1 ||
        subjectNumber > student.subjects.length
    ) {
        console.log(
            "\nInvalid subject selection."
        );

        return;
    }

    const selectedSubject =
        student.subjects[subjectNumber - 1];

    const confirmation = await ask(
        `Delete ${selectedSubject.subject}? (Y/N): `
    );

    if (
        confirmation.toLowerCase() !== "y"
    ) {
        console.log(
            "\nDelete operation cancelled."
        );

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

async function deleteStudentMenu(ask) {
    console.log(
        "\n========== DELETE STUDENT ==========\n"
    );

    const id = await ask(
        "Enter Student ID: "
    );

    const student = findStudent(id);

    if (!student) {
        console.log(
            "\nStudent not found."
        );

        return;
    }

    console.log(
        "\nStudent to be deleted:"
    );

    console.log(
        `ID:      ${student.id}`
    );

    console.log(
        `Name:    ${student.name}`
    );

    console.log("\nSubjects:");

    if (student.subjects.length === 0) {
        console.log("None");
    } else {
        student.subjects.forEach(item => {
            console.log(
                `- ${item.subject}`
            );
        });
    }

    const confirmation = await ask(
        "\nAre you sure you want to delete this student? (Y/N): "
    );

    if (
        confirmation.toLowerCase() !== "y"
    ) {
        console.log(
            "\nDelete operation cancelled."
        );

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

module.exports = {
    addStudentMenu,
    addSubjectMenu,
    viewStudentsMenu,
    searchStudentMenu,
    updateStudentMenu,
    updateSubjectMenu,
    deleteSubjectMenu,
    deleteStudentMenu
};