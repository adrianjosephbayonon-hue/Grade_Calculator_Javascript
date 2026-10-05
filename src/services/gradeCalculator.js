const WEIGHTS = {
    quiz: 0.20,
    assignments: 0.15,
    project: 0.15,
    midterm: 0.20,
    finalExam: 0.30
};

function validateGrade(value) {
    return typeof value === "number" &&
           !Number.isNaN(value) &&
           value >= 0 &&
           value <= 100;
}

function validateGrades(grades) {
    return Object.values(grades).every(validateGrade);
}

function calculateFinalGrade(grades) {
    if (!validateGrades(grades)) {
        throw new Error("All grades must be between 0 and 100.");
    }

    return (
        grades.quiz * WEIGHTS.quiz +
        grades.assignments * WEIGHTS.assignments +
        grades.project * WEIGHTS.project +
        grades.midterm * WEIGHTS.midterm +
        grades.finalExam * WEIGHTS.finalExam
    );
}

function calculateBreakdown(grades) {
    if (!validateGrades(grades)) {
        throw new Error("All grades must be between 0 and 100.");
    }

    return {
        quiz: {
            grade: grades.quiz,
            weight: WEIGHTS.quiz,
            contribution: grades.quiz * WEIGHTS.quiz
        },

        assignments: {
            grade: grades.assignments,
            weight: WEIGHTS.assignments,
            contribution: grades.assignments * WEIGHTS.assignments
        },

        project: {
            grade: grades.project,
            weight: WEIGHTS.project,
            contribution: grades.project * WEIGHTS.project
        },

        midterm: {
            grade: grades.midterm,
            weight: WEIGHTS.midterm,
            contribution: grades.midterm * WEIGHTS.midterm
        },

        finalExam: {
            grade: grades.finalExam,
            weight: WEIGHTS.finalExam,
            contribution: grades.finalExam * WEIGHTS.finalExam
        }
    };
}

function getEquivalentGrade(finalGrade) {
    if (finalGrade >= 90) return "A";
    if (finalGrade >= 85) return "B+";
    if (finalGrade >= 80) return "B";
    if (finalGrade >= 75) return "C";
    if (finalGrade >= 70) return "D";

    return "F";
}

function getStatus(finalGrade) {
    return finalGrade >= 75 ? "PASSED" : "FAILED";
}

module.exports = {
    WEIGHTS,
    validateGrade,
    validateGrades,
    calculateFinalGrade,
    calculateBreakdown,
    getEquivalentGrade,
    getStatus
};