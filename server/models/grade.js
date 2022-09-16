const validator = require("validator");
const _ = require('lodash')
const Ajv = require('ajv')
const ajv = new Ajv()
const addFormats = require("ajv-formats")
addFormats(ajv)
ajv.addFormat('phone', /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)

const gradeSchema = {
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        masuleen: {
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
        },
        classes: {
            type: "array",
            items: {
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
            }
        }
    },
    required: ["name", "masuleen", "classes"]
}

validate = ajv.compile(gradeSchema)

let Grade = (props) => {
    const valid = validate(props)
    return {valid: valid, errors: validate.errors}
}

module.exports = Grade;