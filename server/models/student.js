const _ = require("lodash")

const Ajv = require('ajv')

const student = {
    type: "object",
    properties: {
        its: {
            type: "string",
            minLength: 8,
            maxLength: 8
        },
        firstName: {
            type: "string"
        },
        lastName: {
            type: "string"
        },
        fullName: {
            type: "string"
        },
        arabicName: {
            type: "string"
        },
        grade: {
            type: "string",
        },
        gradeNum: {
            type: "string"
        },
        arabicGrade: {
            type: "string"
        },
        gender: {
            type: "string",
            enum: ["Male", "Female"]
        },
        dob: {
            type: "date"
        },
        allergies: {
            type: string
        },
        feesPaid: {
            type: "string",
            enum: ["3mnths", "6mnths", "full", "special", "notPaid"]
        },
        booksCollected: {
            type: "boolean"
        },
        attendanceClass: {
            type: "object"
        }
    },
    required: [ "its"]
}

let Student = (props) => {
    const requiredKeys = ["its", "firstName", "lastName", "fullName", "grade", "gradeNum", "gender", "dob", "familyID"];
    let propFields = props.keys();

    const validInfo = propFields.every(val => requiredKeys.includes(val));

    if(!validInfo) {
        const missingFields = requiredKeys.filter(val => !propFields.includes(val));
        throw new Error("Missing fields: " + missingFields);
    }

    if(String(props.its).length !== 8) {
        throw new Error("Invalid its.");
    }


    let newStudent = props;
    delete newStudent.familyID;

    newStudent.family = null;
    newStudent.attendanceClass = null;
    newStudent.active = true;

    newStudent.firstName = _.capitalize(_.trim(newStudent.firstName))
    newStudent.lastName = _.capitalize(_.trim(newStudent.lastName))
    newStudent.fullName = _.startCase(_.trim(newStudent.fullName))

    return newStudent;
}

Student.prototype.setFamily = (family, parents) => {
    this.family = family;
    this.parents = parents;
}

Student.prototype.setAttendanceClass = (attendanceClass) => {
    this.attendanceClass = attendanceClass;
}

module.exports = Student;