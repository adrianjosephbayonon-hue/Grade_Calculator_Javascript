class Student {
    constructor(id, name, subjects = []) {
        this.id = id;
        this.name = name;
        this.subjects = subjects;
    }

    addSubject(subject, grades) {
        this.subjects.push({
            subject,
            grades
        });
    }
}

module.exports = Student;