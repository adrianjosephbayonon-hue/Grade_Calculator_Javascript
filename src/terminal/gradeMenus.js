const {
    calculateFinalGrade,
    calculateBreakdown,
    getEquivalentGrade,
    getStatus
} = require("../services/gradeCalculator");

const {
    findStudent
} = require("../services/studentService");

async function calculateStudentMenu(ask) {
    console.log(
        "\n========== GRADE REPORT ==========\n"
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

    if (student.subjects.length === 0) {
        console.log(
            "\nThis student has no subjects."
        );

        return;
    }

    console.log("\nSubjects:");

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

    try {
        const finalGrade =
            calculateFinalGrade(
                selectedSubject.grades
            );

        const breakdown =
            calculateBreakdown(
                selectedSubject.grades
            );

        const equivalent =
            getEquivalentGrade(
                finalGrade
            );

        const status =
            getStatus(finalGrade);

        console.log(
            "\n=============================================="
        );

        console.log(
            "              GRADE REPORT"
        );

        console.log(
            "=============================================="
        );

        console.log(
            `Student:       ${student.name}`
        );

        console.log(
            `Student ID:    ${student.id}`
        );

        console.log(
            `Subject:       ${selectedSubject.subject}`
        );

        console.log(
            "----------------------------------------------"
        );

        console.log(
            `Quiz:          ${breakdown.quiz.grade.toFixed(2)}`
        );

        console.log(
            `Weight:        ${(breakdown.quiz.weight * 100).toFixed(0)}%`
        );

        console.log(
            `Contribution:  ${breakdown.quiz.contribution.toFixed(2)}`
        );

        console.log(
            "----------------------------------------------"
        );

        console.log(
            `Assignments:   ${breakdown.assignments.grade.toFixed(2)}`
        );

        console.log(
            `Weight:        ${(breakdown.assignments.weight * 100).toFixed(0)}%`
        );

        console.log(
            `Contribution:  ${breakdown.assignments.contribution.toFixed(2)}`
        );

        console.log(
            "----------------------------------------------"
        );

        console.log(
            `Project:       ${breakdown.project.grade.toFixed(2)}`
        );

        console.log(
            `Weight:        ${(breakdown.project.weight * 100).toFixed(0)}%`
        );

        console.log(
            `Contribution:  ${breakdown.project.contribution.toFixed(2)}`
        );

        console.log(
            "----------------------------------------------"
        );

        console.log(
            `Midterm:       ${breakdown.midterm.grade.toFixed(2)}`
        );

        console.log(
            `Weight:        ${(breakdown.midterm.weight * 100).toFixed(0)}%`
        );

        console.log(
            `Contribution:  ${breakdown.midterm.contribution.toFixed(2)}`
        );

        console.log(
            "----------------------------------------------"
        );

        console.log(
            `Final Exam:    ${breakdown.finalExam.grade.toFixed(2)}`
        );

        console.log(
            `Weight:        ${(breakdown.finalExam.weight * 100).toFixed(0)}%`
        );

        console.log(
            `Contribution:  ${breakdown.finalExam.contribution.toFixed(2)}`
        );

        console.log(
            "=============================================="
        );

        console.log(
            `Final Grade:    ${finalGrade.toFixed(2)}`
        );

        console.log(
            `Equivalent:     ${equivalent}`
        );

        console.log(
            `Status:         ${status}`
        );

        console.log(
            "=============================================="
        );

    } catch (error) {
        console.log(
            `\nError: ${error.message}`
        );
    }
}

async function academicSummaryMenu(ask) {
    console.log(
        "\n========== ACADEMIC SUMMARY ==========\n"
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

    if (student.subjects.length === 0) {
        console.log(
            "\nThis student has no subjects."
        );

        return;
    }

    let totalGrade = 0;

    console.log(
        "\n=============================================="
    );

    console.log(
        "              ACADEMIC SUMMARY"
    );

    console.log(
        "=============================================="
    );

    console.log(
        `Student:       ${student.name}`
    );

    console.log(
        `Student ID:    ${student.id}`
    );

    console.log(
        "----------------------------------------------"
    );

    console.log(
        "Subject                         Final Grade"
    );

    console.log(
        "----------------------------------------------"
    );

    student.subjects.forEach(item => {
        const finalGrade =
            calculateFinalGrade(
                item.grades
            );

        totalGrade += finalGrade;

        const subjectName =
            item.subject.padEnd(30, " ");

        console.log(
            `${subjectName}${finalGrade.toFixed(2)}`
        );
    });

    const overallAverage =
        totalGrade /
        student.subjects.length;

    const equivalent =
        getEquivalentGrade(
            overallAverage
        );

    const status =
        getStatus(overallAverage);

    console.log(
        "----------------------------------------------"
    );

    console.log(
        `Overall Average: ${overallAverage.toFixed(2)}`
    );

    console.log(
        `Overall Equivalent: ${equivalent}`
    );

    console.log(
        `Overall Status:     ${status}`
    );

    console.log(
        "=============================================="
    );
}

module.exports = {
    calculateStudentMenu,
    academicSummaryMenu
};