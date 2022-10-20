require('dotenv').config()
const jwt = require('jsonwebtoken');
const Staff = require('../models/staff');
const staffRef = db.collection('staff');


const staffAuth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.CRYPT);
        const staff = await staffRef.where('its', '==', decoded.its).get()
        if(staff.empty)
            throw new Error()

        req.token = token;
        req.staff = "";
        staff.forEach(doc => {
            req.staff = doc.data()
        });

        if(!req.staff.tokens.includes(token)) {
            throw new Error()
        }
        next();
    }catch(error){
        res.status(401).send({error: 'Please Authenticate'});
    }
}

module.exports = staffAuth;