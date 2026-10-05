const test = require("node:test");
const assert = require("node:assert");

const {
    calculateFinalGrade,
    calculateBreakdown,
    getEquivalentGrade,
    getStatus,
    validateGrade
} = require("../src/services/gradeCalculator");


test("valid grades should be accepted", () => {
    assert.strictEqual(
        validateGrade(0),
        true
    );

    assert.strictEqual(
        validateGrade(100),
        true
    );

    assert.strictEqual(
        validateGrade(85),
        true
    );
});


test("invalid grades should be rejected", () => {
    assert.strictEqual(
        validateGrade(-1),
        false
    );

    assert.strictEqual(
        validateGrade(101),
        false
    );

    assert.strictEqual(
        validateGrade("85"),
        false
    );
});


test("calculateFinalGrade should calculate the weighted grade correctly", () => {
    const grades = {
        quiz: 88,
        assignments: 92,
        project: 95,
        midterm: 87,
        finalExam: 91
    };

    const result = calculateFinalGrade(grades);

    assert.strictEqual(
        Number(result.toFixed(2)),
        90.35
    );
});


test("calculateFinalGrade should reject invalid grades", () => {
    const grades = {
        quiz: 88,
        assignments: 92,
        project: 95,
        midterm: 87,
        finalExam: 101
    };

    assert.throws(
        () => calculateFinalGrade(grades),
        /All grades must be between 0 and 100/
    );
});


test("calculateBreakdown should calculate contributions", () => {
    const grades = {
        quiz: 100,
        assignments: 100,
        project: 100,
        midterm: 100,
        finalExam: 100
    };

    const breakdown =
        calculateBreakdown(grades);

    assert.strictEqual(
        breakdown.quiz.contribution,
        20
    );

    assert.strictEqual(
        breakdown.assignments.contribution,
        15
    );

    assert.strictEqual(
        breakdown.project.contribution,
        15
    );

    assert.strictEqual(
        breakdown.midterm.contribution,
        20
    );

    assert.strictEqual(
        breakdown.finalExam.contribution,
        30
    );
});


test("getEquivalentGrade should return the correct equivalent", () => {
    assert.strictEqual(
        getEquivalentGrade(95),
        "A"
    );

    assert.strictEqual(
        getEquivalentGrade(88),
        "B+"
    );

    assert.strictEqual(
        getEquivalentGrade(82),
        "B"
    );

    assert.strictEqual(
        getEquivalentGrade(77),
        "C"
    );

    assert.strictEqual(
        getEquivalentGrade(72),
        "D"
    );

    assert.strictEqual(
        getEquivalentGrade(69),
        "F"
    );
});


test("getStatus should determine pass or fail", () => {
    assert.strictEqual(
        getStatus(75),
        "PASSED"
    );

    assert.strictEqual(
        getStatus(90),
        "PASSED"
    );

    assert.strictEqual(
        getStatus(74.99),
        "FAILED"
    );

    assert.strictEqual(
        getStatus(50),
        "FAILED"
    );
});