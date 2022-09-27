const express = require('express');
const router = new express.Router();
const bcyrpt = require('bcryptjs')

const Family = require('../models/family');
const familyRef = db.collection('family');

findByCredentials = async(id, password) => {
    const familyDocRef = familyRef.doc(String(id))
    const family = await familyDocRef.get()
    if(!family.exists) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcyrpt.compare(password, family.data().password)
    if(!isMatch) {
        throw new Error("Unable to login")
    }
    return {"ref": familyDocRef, "data": family.data()}
}

generateAuthToken = async(familyDocRef) => {
    const token = jwt.sign({data: 'foobar'}, process.env.CRYPT, { expiresIn: '1h' });
    
    familyDocRef.update({tokens: FieldValue.arrayUnion(token)})
    
    return token;
}

router.post('/family/login', async(req, res) => {
    try {
        const familyObj = await findByCredentials(req.body.id, req.body.password)
        const token = await generateAuthToken(familyObj.ref)
        const family = familyObj.data
        res.send({family, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router;