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
    required: ["id", "name", "teachers"],
    additionalProperties: false
}

validate = ajv.compile(classSchema)

let Class = (props, callback) => {
    const valid = validate(props)
    if(valid) {
        callback(null)
    } else {
        callback(validate.errors[0].message)
    }
}

module.exports = Class;