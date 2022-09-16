const validator = require("validator");
const _ = require('lodash')
const Ajv = require('ajv')
const ajv = new Ajv()
const addFormats = require("ajv-formats")
addFormats(ajv)
ajv.addFormat('phone', /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)

const classSchema = {
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

validate = ajv.compile(classSchema)

let Class = (props) => {
    const valid = validate(props)
    return {valid: valid, errors: validate.errors}
}

module.exports = Class;