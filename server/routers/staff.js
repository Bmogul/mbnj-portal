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
const classRef = db.collection('classes');

//Grade
const Grade = require('../models/grade');
const gradeRef = db.collection('grade');

//Student
const Student = require('../models/student');
const studentRef = db.collection('students');

//StaffAttendance
const StaffAttendance = require('../models/staffAttendance');
const staffAttendanceRef = db.collection('staffAttendance');

//Family
const familyRef = db.collection('family');

const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const admin = require('firebase-admin')

const { auth } = require('firebase-admin');
const {staffAuth, attendanceAuth, headMAuth, adminAuth, committeeAuth} = require('../middleware/staffAuth');
const { resolveRef } = require('ajv/dist/compile');
const { range } = require('lodash');

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
    const isMatch = await bcyrpt.compare(password, staffData.password)
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
        res.send(error.toString())
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
        res.status(500).send(error.toString())
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
        res.status(500).send(error.toString())
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
        res.status(502).send(error.toString());
    }
})

router.get("/staff/attendanceListAll", headMAuth, async(req, res) => {
    try {
        let attendanceStudentsRef = studentRef.where("status", "==", "Active");
        let snapshot = await attendanceStudentsRef.get();
        if(snapshot.empty) {
            throw new Error("No active students");
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
        res.status(502).send(error.toString());
    }
})

router.get("/staff/attendanceListByClass", headMAuth, async(req, res) => {
    try {
        let classId = req.body.classId
        let attendanceStudentsRef = studentRef.where("attendanceClass.id", "==", parseInt(classId));
        let snapshot = await attendanceStudentsRef.get();
        if(snapshot.empty) {
            throw new Error("No active students");
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
        res.status(502).send(error.toString());
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
                informed: r.informed ? r.informed : "",
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
        res.status(503).send(error.toString())
    }
})

router.get("/dayAttendanceReport", headMAuth, async(req, res) => {
    try{
        const date = req.body.date

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
        res.send(error.toString())
    }
})

router.get("/studentAttendanceReport", headMAuth, async(req, res) => {
    try{
        const its = req.body.its

        let snapshot = await attendanceRef.where("its", "==", its).get()

        if(snapshot.empty) {
            throw new Error("No attendance records for its " + its)
        }

        let student = await studentRef.doc(its).get();
        
        let studentName = ""
        if(student.exists) {
            studentName = student.data().fullName
        } else {
            throw new Error("No student with its " + its)
        }

        recordsList = []
        let index = 0
        await new Promise((resolve => { 
            snapshot.forEach(async(r) => {
                try {
                    let rD = r.data()
                    let status = rD.present
                    

                    let studentRecord = { 
                        its: its,
                        name: studentName,
                        date: rD.date,
                        status: status,
                        reasonOfAbsence: rD.reasonOfAbsence ? rD.reasonOfAbsence : ""

                    }
                    recordsList.push(studentRecord)
                    
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

        res.send(recordsList)

    } catch (error) {
        res.send(error.toString())
    }
})

router.get("/lunchReport", committeeAuth, async(req, res) => {
    try{
        // let date = new Date().toISOString().split("T")[0]
        let date = req.body.date;
        if(date == undefined) {
            date = new Date().toISOString().split("T")[0]
        }

        let snapshot = await attendanceRef.where("date", "==", date).get()

        if(snapshot.empty) {
            throw new Error("No attendance records for day")
        }
        allergies = []
        gradeCounts = {
            'P': {
                count: 0,
                male: 0,
                female: 0
            },
            'K': {
                count: 0,
                male: 0,
                female: 0
            },
            '1': {
                count: 0,
                male: 0,
                female: 0
            },
            '2': {
                count: 0,
                male: 0,
                female: 0
            },
            '3': {
                count: 0,
                male: 0,
                female: 0
            },
            '4': {
                count: 0,
                male: 0,
                female: 0
            },
            '5': {
                count: 0,
                male: 0,
                female: 0
            },
            '6': {
                count: 0,
                male: 0,
                female: 0
            },
            '7': {
                count: 0,
                male: 0,
                female: 0
            },
            '8': {
                count: 0,
                male: 0,
                female: 0
            },
            '9': {
                count: 0,
                male: 0,
                female: 0
            },
            '10': {
                count: 0,
                male: 0,
                female: 0
            }
        }
        let index = 0
        await new Promise((resolve => { 
            snapshot.forEach(async(s) => {
                try {
                    
                    let sD = s.data()
                    let its = sD.its
                    if(sD.present == "Late-In" || sD.present=="Present") {
                        let student = await studentRef.doc(its).get();

                        if(student.exists) {
                            let grade= student.data().gradeNum[0];
                            gradeCounts[grade].count++;
                            if(student.data().gender == "Male") {
                                gradeCounts[grade].male++;
                            } else {
                                gradeCounts[grade].female++;
                            }
                            if(student.data().allergies != "None") {
                                allergies.push({
                                    name: student.data().name,
                                    allergies: student.data().allergies
                                })
                            }
                        }
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

        gradeCounts["PreK"] = gradeCounts.P;
        gradeCounts["KG"] = gradeCounts.K;
        delete gradeCounts.P;
        delete gradeCounts.K
        gradeCounts.allergies = allergies

        res.send(gradeCounts)

    } catch (error) {
        res.send(error.toString())
    }
})

router.get("/gradeDayAttendanceReport", headMAuth, async(req, res) => {
    try{
        const grade = req.body.grade
        const date = req.body.date

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
                        if(student.data().grade === grade){
                            let studentRecord = { 
                                its: its,
                                name: student.data().fullName,
                                status: status,
                                reasonOfAbsence: sD.reasonOfAbsence ? sD.reasonOfAbsence : ""

                            }
                            studentsList.push(studentRecord)
                        }
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
        res.send(error.toString())
    }
})


router.get("/staff/getStudentProfile", headMAuth, async(req, res) => {
    try{
        let its = req.body.its;
        let student = await studentRef.doc(its).get();
        let studentData = {}

        if(student.exists) {
            studentData = student.data()
            delete studentData.firstName
            delete studentData.lastName
            delete studentData.attendanceClass

        } else {
            res.send("No student found")
        }

        res.send(studentData)
    } catch (error){
        res.send(error.toString())
    }
})

router.get("/getTeacherAvailability", headMAuth, async(req, res) => {
    try {
        let availability = {}

        let snapshot = await staffRef.where('role', 'array-contains-any', ['teacher', 'attendanceT', 'headM']).get()

        if(snapshot.empty) {
            throw new Error("No teachers found")
        }

        for(let i = 1; i <= 7; i++) {
            availability[i] = {
                'inClass': [],
                'available': [],
                'notAvailable': []
            }
        }

        snapshot.forEach((s) => {
            let sD = s.data()
            let name = sD.name
            let classes = sD.classes
            classes.forEach((c) => {
                let period = parseInt(c.period)
                if(c.class.name === "Free") {
                    availability[period].available.push(name)
                } else if(c.class.name === "None") {
                    availability[period].notAvailable.push(name)
                } else {
                    availability[period].inClass.push(name)
                }
            })

        })

        res.send(availability)
    } catch (error) {
        res.send(error.toString())
    }


})

router.post("/addStudent", headMAuth, async(req, res) => {
    try {
        let student = req.body.student

        let familyId = student.family
        let snapshot = await familyRef.doc(familyId).get()
        if(snapshot.exists) {
            let data = snapshot.data()
            student.family = {
                address: data.address,
                id: data.id
            }
            student.parents = data.parents
        } else {
            throw new Error("Family does not exist")
        }

        let attendanceClassId = student.attendanceClass
        snapshot = await classRef.doc(attendanceClassId).get()
         if(snapshot.exists) {
            let data = snapshot.data()
            student.attendanceClass = data
        } else {
            throw new Error("Class does not exist")
        }

        Student(student, (err) => {
            if(!err) {
                studentRef.doc(student.its).set(student)
            } else {
                res.send(err.toString())
            }
        })
        res.send("Student added.")
    } catch (error) {
        res.send(error.toString())
    }
})
module.exports = router;