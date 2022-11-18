const express = require('express');
const router = new express.Router();

// Staff
const Staff = require('../models/staff');
const staffRef = db.collection('staff');

//Attendance
const Attendance = require('../models/attendance');
const attendanceRef = db.collection('attendance');

//Class
const Class = require('../models/class');
const classRef = db.collection('class');

//Grade
const Grade = require('../models/grade');
const gradeRef = db.collection('grade');

//Student
const Student = require('../models/student');
const studentRef = db.collection('students');

//StaffAttendance
const StaffAttendance = require('../models/staffAttendance');
const staffAttendanceRef = db.collection('staffAttendance');

const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const admin = require('firebase-admin')

const { auth } = require('firebase-admin');
const {staffAuth, attendanceAuth, headMAuth, adminAuth} = require('../middleware/staffAuth');
const { resolveRef } = require('ajv/dist/compile');

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
    return {"its": staffData.its, "data": staffData, "role": staffData.role}
}

generateAuthToken = async(its, role) => {    
    const token = jwt.sign({its: its, role: role}, process.env.CRYPT);

    const up = await staffRef.doc(its).update({
        tokens: admin.firestore.FieldValue.arrayUnion(token)
    })

    return token;
}

router.post('/staff/login', async(req, res) => {
    try {
        const staffObj = await findByCredentials(req.body.its, req.body.password)
        const token = await generateAuthToken(staffObj.its, staffObj.role)
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

router.get("/staff/attendanceList", attendanceAuth, async(req, res) => {
    try {

        let attendanceID = req.staff.attendanceClass.id;

        let attendanceStudentsRef = studentRef.where("attendanceClass.id", "==", parseInt(attendanceID));
        let snapshot = await attendanceStudentsRef.get();
        if(snapshot.empty) {
            throw new Error("No students in class");
        }

        studentsList = []
        let index = 0
        await new Promise((resolve => { 
            snapshot.forEach(async(s) => {
                try {
                    let sD = s.data()
                    let date = new Date().toISOString().split("T")[0]
                    let searchKey = date + ":" + sD.its
                    let pres = await attendanceRef.doc(searchKey).get();
                    let presentStatus = null;

                    if(pres.exists) {
                        presentStatus = pres.data().present
                    }
                    let sData = { 
                        fullName: sD.fullName,
                        grade: sD.grade,
                        its: sD.its,
                        present: presentStatus
                    }
                    studentsList.push(sData)
                } catch (err) {
                    throw err;
                } finally {
                    index += 1
                    if(index == snapshot.size) {
                        resolve();
                    }
                }
            })
        }))

        
        res.send(studentsList)
        
    } catch (error) {
        res.status(502).send(error);
    }
})

router.post("/staff/submitAttendance", attendanceAuth, async(req, res) => {
    try{
        req.body.attendanceList.forEach((r) => {
            let date = new Date().toISOString().split("T")[0]
            let searchKey = date + ":" + r.its
            attendanceRecord = {
                date : date,
                its : r.its,
                present : r.present,
                reasonOfAbsence: r.reasonOfAbsence ? r.reasonOfAbsence : ""
            }
            Attendance(attendanceRecord, (err) => {
                if(!err) {
                    attendanceRef.doc(searchKey).set(attendanceRecord)
                } else {
                    throw err;
                }
            })
        })

        res.send("Updated attendance")
    } catch (error) {
        res.status(503).send(error)
    }
})

router.get("/dayAttendanceReport/:date", headMAuth, async(req, res) => {
    try{
        const date = req.params.date

        let snapshot = await attendanceRef.where("date", "==", date).get()

        if(snapshot.empty) {
            throw new Error("No attendance records for day")
        }

        studentsList = []
        let index = 0
        await new Promise((resolve => { 
            snapshot.forEach(async(s) => {
                try {
                    let sD = s.data()
                    let its = sD.its
                    let status = sD.present
                    let student = await studentRef.doc(its).get();

                    if(student.exists) {
                        let studentRecord = { 
                            its: its,
                            name: student.data().fullName,
                            status: status,
                            reasonOfAbsence: sD.reasonOfAbsence ? sD.reasonOfAbsence : ""

                        }
                        studentsList.push(studentRecord)
                    }
                    
                } catch (err) {
                    throw err;
                } finally {
                    index += 1
                    if(index == snapshot.size) {
                        resolve();
                    }
                }
            })
        }))

        res.send(studentsList)

    } catch (error) {
        res.send({error: error})
    }
} )

module.exports = router;