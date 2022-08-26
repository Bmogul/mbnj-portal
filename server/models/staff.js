const validator = require("validator");

let Staff = (props) => {
    const requiredKeys = ["its", "name", "role", "phone"];
    let propFields = props.keys();

    const validInfo = propFields.every(val => requiredKeys.includes(val));

    if(!validInfo) {
        const missingFields = requiredKeys.filter(val => !propFields.includes(val));
        throw new Error("Missing fields: " + missingFields);
    }

    let newStaff = props;

    if(!newStaff.hasOwnProperty('classes')) {
        newStaff.classes = null;
    }

    if(!newStaff.hasOwnProperty('attendanceClass')) {
        newStaff.attendanceClass = null;
    }

    return newStaff;
}

module.exports = Staff;