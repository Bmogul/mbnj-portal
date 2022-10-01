require('dotenv').config({path: "../../.env"})

const express = require('express');
const router = new express.Router();
const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const admin = require('firebase-admin')

const Family = require('../models/family');
const { auth } = require('firebase-admin');
const familyRef = db.collection('family');
const familyAuth = require('../middleware/familyAuth')

findByCredentials = async(username, password) => {
    const familyDocRef = familyRef.where("username", "==", username)
    familyData = ""
    const snap = await familyDocRef.get()
    if(snap.empty) {
        throw new Error('Unable to login')
    } else {
        snap.forEach(doc => {
            familyData = doc.data()
        });    
    }
    const isMatch = (familyData.password == process.env.TEST_PASSWORD)
    if(!isMatch) {
        console.log("Incorrect password");
        throw new Error("Unable to login")
    }
    return {"id": familyData.id, "data": familyData}
}

generateAuthToken = async(id) => {    
    const token = jwt.sign({id: id}, process.env.CRYPT, { expiresIn: '1h' });

    const up = await familyRef.doc(id).update({
        tokens: admin.firestore.FieldValue.arrayUnion(token)
    })

    return token;
}

router.post('/family/login', async(req, res) => {
    try {
        const familyObj = await findByCredentials(req.body.username, req.body.password)
        const token = await generateAuthToken(familyObj.id)
        const family = familyObj.data
        res.send({family, token})
    } catch (error) {
        res.send({error})
    }
})

router.post('/family/logout', familyAuth, async(req, res) => {
    try {
        req.family.tokens = req.family.tokens.filter(t => {
            return t != req.token
        })
        await familyRef.doc(req.family.id).update({
            tokens: req.family.tokens
        })
        res.send()
    } catch(error) {
        res.status(500).send(error)
    }
})

router.post('/family/logoutAll', familyAuth, async(req, res) => {
    try {
        req.family.tokens = []
        await familyRef.doc(req.family.id).update({
            tokens: req.family.tokens
        })

        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/family/profile", familyAuth, async(req, res) => {
    delete req.family.password;
    delete req.family.tokens;
    res.send(req.family);
})

module.exports = router;