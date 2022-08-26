const validator = require("validator");

let Class = (props) => {
    const requiredKeys = ["id", "name", "teachers"];
    let propFields = props.keys();

    const validInfo = propFields.every(val => requiredKeys.includes(val));

    if(!validInfo) {
        const missingFields = requiredKeys.filter(val => !propFields.includes(val));
        throw new Error("Missing fields: " + missingFields);
    }

    let newClass = props;

    if(!Array.isArray(props.teachers)) {
        newClass.teachers = [props.teachers];
    }

    return newClass;
}

module.exports = Class;