const validator = require("validator");
const _ = require('lodash')
const Ajv = require('ajv')
const ajv = new Ajv()
const addFormats = require("ajv-formats")
addFormats(ajv)
ajv.addFormat('phone', /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)

const studentSchema = {
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
            type: "string",
            format: "date"    
        },
        allergies: {
            type: "string"
        },
        feesPaid: {
            type: "string",
            enum: ["3mnths", "6mnths", "full", "special", "notPaid"]
        },
        booksCollected: {
            type: "boolean"
        },
        hifzMakan: {
            type: "string"
        },
        surat: {
            type: "string"
        },
        ayah: {
            type: "string"
        },
        status: {
            type: "string",
            enum: ["Active", "Inactive"]
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
                                format: "phone"
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
    required: ["its", "firstName", "lastName", "fullName", "grade", "gradeNum", "gender", "dob", "allergies", "feesPaid", "booksCollected", "attendanceClass", "family", "parents", "status"],
    additionalProperties: false
}

const validate = ajv.compile(studentSchema)

const Student = (props, callback) => {
    const valid = validate(props)
    if(valid) {
        callback(null)
    } else {
        callback(validate.errors[0].message)
    }
}

module.exports = Student;