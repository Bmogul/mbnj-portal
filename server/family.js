let Family = (props) => {
    const requiredKeys = ["ID", "address"];
    let propFields = props.keys();

    const validInfo = propFields.every(val => requiredKeys.includes(val));

    if(!validInfo) {
        const missingFields = requiredKeys.filter(val => !propFields.includes(val));
        throw new Error("Missing fields: " + missingFields);
    }

    let newFamily = props;

    if(!newFamily.hasOwnProperty('username')) {
        newFamily.username = null;
    }

    newFamily.address = _.startCase(_.trim(newFamily.address))
}

Family.prototype.addParents = (parents) => {
    this.parents = parents;
}

module.exports = Family;