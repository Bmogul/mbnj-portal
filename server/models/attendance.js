const validator = require("validator");
const _ = require('lodash')
const Ajv = require('ajv')
const ajv = new Ajv()
const addFormats = require("ajv-formats")
addFormats(ajv)

const attendanceSchema = {
    type: "object",
    properties: {
        date: {
            type: "string",
            format: "date"
        },
        its: {
            type: "string",
            minLength: 8,
            maxLength: 8
        },
        present: {
            type: "string",
            enum: ["Present", "Absent", "Late-In", "Early-Out"]
        },
        informed: {
            type: "string",
            enum: ["Informed", "Uninformed", ""]
        },
        reasonOfAbsence: {
            type: "string"
        },
    },
    required: ["date", "its", "present"],
    additionalProperties: false
}



const validate = ajv.compile(attendanceSchema)

const Attendance = (props, callback) => {
    const valid = validate(props)
    if(valid) {
        callback(null)
    } else {
        callback(validate.errors[0].message)
    }
}

module.exports = Attendance;