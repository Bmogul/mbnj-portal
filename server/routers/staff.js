const express = require('express');
const router = new express.Router();

const Staff = require('../models/staff');
const staffRef = db.collection('staff');

const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const admin = require('firebase-admin')

const { auth } = require('firebase-admin');
const staffAuth = require('../middleware/staffAuth')

findByCredentials = async(its, password) => {
    const staffDocRef = staffRef.where("its", "==", its)
    staffData = ""
    const snap = await staffDocRef.get()
    if(snap.empty) {
        throw new Error('Unable to login')
    } else {
        snap.forEach(doc => {
            staffData = doc.data()
        });    
    }
    const isMatch = bcyrpt.compare(password, staffData.password)
    if(!isMatch) {
        throw new Error("Unable to login")
    }
    return {"its": staffData.its, "data": staffData}
}

generateAuthToken = async(its) => {    
    const token = jwt.sign({its: its}, process.env.CRYPT, { expiresIn: '1h' });

    const up = await staffRef.doc(its).update({
        tokens: admin.firestore.FieldValue.arrayUnion(token)
    })

    return token;
}

router.post('/staff/login', async(req, res) => {
    try {
        const staffObj = await findByCredentials(req.body.its, req.body.password)
        const token = await generateAuthToken(staffObj.its)
        const staff = staffObj.data
        delete staff.password;
        delete staff.tokens;
        res.send({staff, token})
    } catch (error) {
        res.send({error})
    }
})

router.post('/staff/logout', staffAuth, async(req, res) => {
    try {
        req.staff.tokens = req.staff.tokens.filter(t => {
            return t != req.token
        })
        await staffRef.doc(req.staff.its).update({
            tokens: req.staff.tokens
        })
        res.send()
    } catch(error) {
        res.status(500).send(error)
    }
})

router.post('/staff/logoutAll', staffAuth, async(req, res) => {
    try {
        req.staff.tokens = []
        await staffRef.doc(req.staff.its).update({
            tokens: req.staff.tokens
        })

        res.send("Logged out all.")
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/staff/profile", staffAuth, async(req, res) => {
    delete req.staff.password;
    delete req.staff.tokens;
    res.send(req.staff);
})

router.post("/staff/setup", async(req, res) => {
    try {
        its = req.body.its;
        def_password = req.body.def_password;
        password = req.body.password;
        if(def_password != process.env.DEFAULT_PASSWORD) {
            throw new Error("Incorrect password");
        }

        const staffDocRef = staffRef.where("its", "==", its)
        staffData = ""
        const snap = await staffDocRef.get()
        if(snap.empty) {
            throw new Error('ITS not found')
        } else {
            snap.forEach(doc => {
                staffData = doc.data()
            });    
        }

        await staffRef.doc(staffData.its).update({
            password: await bcyrpt.hash(password, 8)
        })

        res.send("Password setup complete");


    } catch (error){
        res.status(401).send("Invalid Credentials");
    }
})

module.exports = router;