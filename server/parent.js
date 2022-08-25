const validator = require("validator");

let Parent = (props) => {
    const requiredKeys = ["its", "name", "phone", "email"];
    let propFields = props.keys();

    const validInfo = propFields.every(val => requiredKeys.includes(val));

    if(!validInfo) {
        const missingFields = requiredKeys.filter(val => !propFields.includes(val));
        throw new Error("Missing fields: " + missingFields);
    }

    if(!validator.isMobilePhone(props.phone)) {
        throw new Error("Invalid phone number.");
    }

    if(!validator.isEmail(props.email)) {
        throw new Error("Invalid email address.")
    }

    let newFamily = props;
}

module.exports = Parent;