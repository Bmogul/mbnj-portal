const jwt = require('jsonwebtoken');
const Family = require('../models/family');
const familyRef = db.collection('family');


const familyAuth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.CRYPT);
        const family = await familyRef.where('id', '==', decoded.id).where('tokens', 'array-contains', token).get()
        if(!family)
            throw new Error()
        req.token = token;
        req.member = member;
        next();
    }catch(error){
        res.status(401).send({error: 'Please Authenticate'});
    }
}

module.exports = auth;