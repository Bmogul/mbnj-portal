const validator = require("validator");
const _ = require('lodash')
const Ajv = require('ajv')
const ajv = new Ajv()
const addFormats = require("ajv-formats")
addFormats(ajv)
ajv.addFormat('phone', /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)

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
        status: {
            type: "string"
        },
        attendanceClass: {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                name: {
                    type: "string"
                },
                teachers: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string"
                            },
                            phone: {
                                type: "string",
                                format: ""
                            }
                        },
                        required: ["name", "phone"]
                    }
                }
            },
            required: ["id", "name", "teachers"]
        },
        family: {
            type: "object",
            properties: {
                id: {
                    type: "string"
                },
                address: {
                    type: "string"
                }
            },
            required: ["id", "address"]
        },
        parents: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    its: {
                        type: "string",
                        minLength: 8,
                        maxLength: 8,
                    },
                    name: {
                        type: "string"
                    },
                    phone: {
                        type: "string",
                        format: "phone"
                    },
                    emails: {
                        type: "array",
                        items: {
                            type: "string",
                            format: "email"
                        }
                    }
                },
                required: ["its", "name", "phone", "emails"]
            }
        }
    },
    required: ["its", "firstName", "lastName", "fullName", "grade", "gradeNum", "gender", "dob", "allergies", "feesPaid", "booksCollected", "attendanceClass", "family", "parents", "status"]
}

// let Student = (props) => {
//     const requiredKeys = ["its", "firstName", "lastName", "fullName", "grade", "gradeNum", "gender", "dob", "familyID"];
//     let propFields = props.keys();

//     const validInfo = propFields.every(val => requiredKeys.includes(val));

//     if(!validInfo) {
//         const missingFields = requiredKeys.filter(val => !propFields.includes(val));
//         throw new Error("Missing fields: " + missingFields);
//     }

//     if(String(props.its).length !== 8) {
//         throw new Error("Invalid its.");
//     }


//     let newStudent = props;
//     delete newStudent.familyID;

//     newStudent.family = null;
//     newStudent.attendanceClass = null;
//     newStudent.active = true;

//     newStudent.firstName = _.capitalize(_.trim(newStudent.firstName))
//     newStudent.lastName = _.capitalize(_.trim(newStudent.lastName))
//     newStudent.fullName = _.startCase(_.trim(newStudent.fullName))

//     return newStudent;
// }

// Student.prototype.setFamily = (family, parents) => {
//     this.family = family;
//     this.parents = parents;
// }

// Student.prototype.setAttendanceClass = (attendanceClass) => {
//     this.attendanceClass = attendanceClass;
// }

module.exports = student;