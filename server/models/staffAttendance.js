const validator = require("validator");

let StaffAttendance = (props) => {
    const requiredKeys = ["date", "its", "present"];
    let propFields = props.keys();

    const validInfo = propFields.every(val => requiredKeys.includes(val));

    if(!validInfo) {
        const missingFields = requiredKeys.filter(val => !propFields.includes(val));
        throw new Error("Missing fields: " + missingFields);
    }

    if(!validator.isBoolean(props.present, {loose: true}) {
        throw new Error("Invalid present field.");
    }

    let newStaffAttendance = props;
    newStaffAttendance.present = (props.present.toLowerCase() === 'true');

    return newStaffAttendance;
}

module.exports = StaffAttendance;