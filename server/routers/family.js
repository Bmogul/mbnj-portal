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
    const isMatch = await bcyrpt.compare(password, familyData.password)
    if(!isMatch) {
        throw new Error("Unable to login")
    }
    return {"id": familyData.id, "data": familyData}
}

generateAuthToken = async(id) => {    
    const token = jwt.sign({id: id}, process.env.CRYPT);

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
        delete family.password;
        delete family.tokens;
        res.send({family, token})
    } catch (error) {
        res.send(error.toString())
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
        res.status(500).send(error.toString())
    }
})

router.post('/family/logoutAll', familyAuth, async(req, res) => {
    try {
        req.family.tokens = []
        await familyRef.doc(req.family.id).update({
            tokens: req.family.tokens
        })

        res.send("Logged out all.")
    } catch (error) {
        res.status(500).send(error.toString())
    }
})

router.get("/family/profile", familyAuth, async(req, res) => {
    delete req.family.password;
    delete req.family.tokens;
    res.send(req.family);
})

router.post("/family/setup", async(req, res) => {
    try {
        username = req.body.username;
        def_password = req.body.def_password;
        password = req.body.password;
        if(def_password != process.env.DEFAULT_PASSWORD) {
            throw new Error("Incorrect password");
        }

        const familyDocRef = familyRef.where("username", "==", username)
        familyData = ""
        const snap = await familyDocRef.get()
        if(snap.empty) {
            throw new Error('Username not found')
        } else {
            snap.forEach(doc => {
                familyData = doc.data()
            });    
        }

        await familyRef.doc(familyData.id).update({
            password: await bcyrpt.hash(password, 8)
        })

        res.send("Password setup complete");


    } catch (error){
        res.status(401).send("Invalid Credentials");
    }
})

module.exports = router;