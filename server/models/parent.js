const validator = require("validator");
const _ = require('lodash')
const Ajv = require('ajv')
const ajv = new Ajv()
const addFormats = require("ajv-formats")

addFormats(ajv)

ajv.addFormat('phone', /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)

const parentSchema = {
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
            // validate(value) {
            //     if(!validator.isMobilePhone(value)) {
            //         throw new Error('Phone number is invalid')
            //     }
            // }
        },
        emails: {
            type: "array",
            items: {
                type: "string",
                format: "email"
                // valdiate(value) {
                //     if(!validator.isEmail(value)) {
                //         throw new Error("Email is not valid")
                //     }
                // }
            }
        }
    },
    required: ["its", "name", "phone", "emails"]
}

const validate = ajv.compile(parentSchema)

const Parent = (props) => {
    const valid = validate(props)
    return {valid: valid, errors: validate.errors}
}

module.exports = Parent;