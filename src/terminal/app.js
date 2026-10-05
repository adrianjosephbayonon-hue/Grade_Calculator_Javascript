const readline = require("readline");

const {
    addStudentMenu,
    addSubjectMenu,
    viewStudentsMenu,
    searchStudentMenu,
    updateStudentMenu,
    updateSubjectMenu,
    deleteSubjectMenu,
    deleteStudentMenu
} = require("./studentMenus");

const {
    calculateStudentMenu,
    academicSummaryMenu
} = require("./gradeMenus");

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

        const choice = await ask(
            "Enter choice: "
        );

        switch (choice) {
            case "1":
                await addStudentMenu(ask);
                break;

            case "2":
                await addSubjectMenu(ask);
                break;

            case "3":
                await calculateStudentMenu(ask);
                break;

            case "4":
                await viewStudentsMenu();
                break;

            case "5":
                await searchStudentMenu(ask);
                break;

            case "6":
                await academicSummaryMenu(ask);
                break;

            case "7":
                await updateStudentMenu(ask);
                break;

            case "8":
                await updateSubjectMenu(ask);
                break;

            case "9":
                await deleteSubjectMenu(ask);
                break;

            case "10":
                await deleteStudentMenu(ask);
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