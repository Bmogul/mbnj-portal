const validator = require("validator");

let Grade = (props) => {
    const requiredKeys = ["name", "teacher", "classes"];
    let propFields = props.keys();

    const validInfo = propFields.every(val => requiredKeys.includes(val));

    if(!validInfo) {
        const missingFields = requiredKeys.filter(val => !propFields.includes(val));
        throw new Error("Missing fields: " + missingFields);
    }


    let newGrade = props;

    return newGrade;
}

Grade.prototype.setClasses = (classes) => {
    this.classes = classes;
}

module.exports = Grade;