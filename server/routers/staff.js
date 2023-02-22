const express = require('express');
const router = new express.Router();
const crypto = require('crypto')

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

const emailRef = db.collection('emails')

const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const admin = require('firebase-admin')

const { staffAuth, attendanceAuth, headMAuth, adminAuth, committeeAuth } = require('../middleware/staffAuth');
const { resolveRef } = require('ajv/dist/compile');
const { range } = require('lodash');

const { google } = require('googleapis')

const auth = new google.auth.GoogleAuth({
    keyFile: __dirname + "/../db/mbnjdb-service-account.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
})



findByCredentials = async (its, password) => {
    const staffDocRef = staffRef.where("its", "==", its)
    staffData = ""
    const snap = await staffDocRef.get()
    if (snap.empty) {
        throw new Error('Unable to login')
    } else {
        snap.forEach(doc => {
            staffData = doc.data()
        });
    }
    const isMatch = await bcyrpt.compare(password, staffData.password)
    if (!isMatch) {
        throw new Error("Incorrect password")
    }
    return { "its": staffData.its, "data": staffData, "role": staffData.role }
}

generateAuthToken = async (its, role) => {
    const token = jwt.sign({ its: its, role: role }, process.env.CRYPT);

    const up = await staffRef.doc(its).update({
        tokens: admin.firestore.FieldValue.arrayUnion(token)
    })

    return token;
}

router.post('/staff/login', async (req, res) => {
    try {
        if (!req.body.its || !/^[0-9]{8}$/.test(req.body.its)) {
            // alert('Please input a valid ITS')
            throw new Error("Please input a valid ITS") 
        }
        if (!req.body.password) {
            // alert('Please input a valid Password')
            throw new Error("Please input a valid Password") 
        }
        const staffObj = await findByCredentials(req.body.its, req.body.password)
        const token = await generateAuthToken(staffObj.its, staffObj.role)
        const staff = staffObj.data
        delete staff.password;
        delete staff.tokens;
        res.send({ staff, token })
    } catch (error) {
        res.status(400).send({error: error.toString()})
    }
})

router.post('/staff/logout', staffAuth, async (req, res) => {
    try {
        req.staff.tokens = req.staff.tokens.filter(t => {
            return t != req.token
        })
        await staffRef.doc(req.staff.its).update({
            tokens: req.staff.tokens
        })
        res.send()
    } catch (error) {
        res.status(500).send(error.toString())
    }
})

router.post('/staff/logoutAll', staffAuth, async (req, res) => {
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

router.get("/staff/profile", staffAuth, async (req, res) => {
    delete req.staff.password;
    delete req.staff.tokens;
    res.send(req.staff);
})

router.post("/staff/setup", async (req, res) => {
    try {
        its = req.body.its;
        def_password = req.body.def_password;
        password = req.body.password;
        if (def_password != process.env.DEFAULT_PASSWORD) {
            throw new Error("Incorrect password");
        }

        const staffDocRef = staffRef.where("its", "==", its)
        staffData = ""
        const snap = await staffDocRef.get()
        if (snap.empty) {
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


    } catch (error) {
        res.status(401).send("Invalid Credentials");
    }
})

router.post("/staff/forgotPassword", async (req, res) => {
    try {
        const authClientObject = await auth.getClient()

        const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject })
        const spreadsheetId = process.env.SHEETID
        let its = req.body.its

        const snap = await staffRef.doc(its).get()

        if (!snap.exists) {
            throw new Error("Invalid its.")
        }

        let code = crypto.randomBytes(4).toString('hex')
        let emailAddress = snap.data().email

        await staffRef.doc(its).update({
            password: await bcyrpt.hash(code, 8)
        })

        // let email = {
        //     to: emailAddress,
        //     message: {
        //         subject: "MBNJ portal password reset",
        //         html: "Your OTP is <code>" + code + "</code>. To reset your password <a href='" + "'>Click Here</a>."
        //     }
        // }

        await googleSheetsInstance.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Sheet1!A:B",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[emailAddress, code]]
            }
        })

        // const status = await emailRef.add(email)

        res.send("One time password sent.")

    } catch (error) {
        res.send(error.toString())
    }
})

router.post("/staff/resetPassword", async (req, res) => {
    try {
        let otp = req.body.otp
        let its = req.body.its
        let newPassword = req.body.password

        const snap = await staffRef.doc(its).get()

        if (!snap.exists) {
            res.send("Invalid its.")
        }

        let realOTP = snap.data().password

        const isMatch = await bcyrpt.compare(otp, realOTP)
        if (!isMatch) {
            throw new Error("Incorrect OTP")
        }

        await staffRef.doc(its).update({
            password: await bcyrpt.hash(newPassword, 8)
        })

        res.send("Password reset complete");
    } catch (error) {
        res.send(error.toString())
    }

})

router.get("/staff/attendanceList", attendanceAuth, async (req, res) => {
    try {

        let attendanceID = req.staff.attendanceClass.id;

        let attendanceStudentsRef = studentRef.where("attendanceClass.id", "==", attendanceID);
        let snapshot = await attendanceStudentsRef.get();
        if (snapshot.empty) {
            throw new Error("No students in class");
        }

        studentsList = []
        let index = 0
        await new Promise((resolve => {
            snapshot.forEach(async (s) => {
                try {
                    let sD = s.data()
                    let date = new Date().toISOString().split("T")[0]
                    let searchKey = date + ":" + sD.its
                    let pres = await attendanceRef.doc(searchKey).get();
                    let presentStatus = null;

                    if (pres.exists) {
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
                    if (index == snapshot.size) {
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

router.get("/staff/attendanceListAll", headMAuth, async (req, res) => {
    try {
        let attendanceStudentsRef = studentRef.where("status", "==", "Active");
        let snapshot = await attendanceStudentsRef.get();
        if (snapshot.empty) {
            throw new Error("No active students");
        }

        studentsList = []
        let index = 0
        await new Promise((resolve => {
            snapshot.forEach(async (s) => {
                try {
                    let sD = s.data()
                    let date = new Date().toISOString().split("T")[0]
                    let searchKey = date + ":" + sD.its
                    let pres = await attendanceRef.doc(searchKey).get();
                    let presentStatus = null;

                    if (pres.exists) {
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
                    if (index == snapshot.size) {
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

router.get("/staff/attendanceListByClass", headMAuth, async (req, res) => {
    try {
        let classId = req.body.classId
        let attendanceStudentsRef = studentRef.where("attendanceClass.id", "==", parseInt(classId));
        let snapshot = await attendanceStudentsRef.get();
        if (snapshot.empty) {
            throw new Error("No active students");
        }

        studentsList = []
        let index = 0
        await new Promise((resolve => {
            snapshot.forEach(async (s) => {
                try {
                    let sD = s.data()
                    let date = new Date().toISOString().split("T")[0]
                    let searchKey = date + ":" + sD.its
                    let pres = await attendanceRef.doc(searchKey).get();
                    let presentStatus = null;

                    if (pres.exists) {
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
                    if (index == snapshot.size) {
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

router.post("/staff/submitAttendance", attendanceAuth, async (req, res) => {
    try {
        req.body.attendanceList.forEach((r) => {
            let date = new Date().toISOString().split("T")[0]
            let searchKey = date + ":" + r.its
            attendanceRecord = {
                date: date,
                its: r.its,
                present: r.present,
                informed: r.informed ? r.informed : "",
                reasonOfAbsence: r.reasonOfAbsence ? r.reasonOfAbsence : ""
            }
            Attendance(attendanceRecord, (err) => {
                if (!err) {
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

router.get("/dayAttendanceReport", headMAuth, async (req, res) => {
    try {
        const date = req.body.date

        let snapshot = await attendanceRef.where("date", "==", date).get()

        if (snapshot.empty) {
            throw new Error("No attendance records for day")
        }

        studentsList = []
        let index = 0
        await new Promise((resolve => {
            snapshot.forEach(async (s) => {
                try {
                    let sD = s.data()
                    let its = sD.its
                    let status = sD.present
                    let student = await studentRef.doc(its).get();

                    if (student.exists) {
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
                    if (index == snapshot.size) {
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

router.get("/studentAttendanceReport", headMAuth, async (req, res) => {
    try {
        const its = req.body.its

        let snapshot = await attendanceRef.where("its", "==", its).get()

        if (snapshot.empty) {
            throw new Error("No attendance records for its " + its)
        }

        let student = await studentRef.doc(its).get();

        let studentName = ""
        if (student.exists) {
            studentName = student.data().fullName
        } else {
            throw new Error("No student with its " + its)
        }

        recordsList = []
        let index = 0
        await new Promise((resolve => {
            snapshot.forEach(async (r) => {
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
                    if (index == snapshot.size) {
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

router.get("/lunchReport", committeeAuth, async (req, res) => {
    try {
        // let date = new Date().toISOString().split("T")[0]
        let date = req.body.date;
        if (date == undefined) {
            date = new Date().toISOString().split("T")[0]
        }

        let snapshot = await attendanceRef.where("date", "==", date).get()

        if (snapshot.empty) {
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
            snapshot.forEach(async (s) => {
                try {

                    let sD = s.data()
                    let its = sD.its
                    if (sD.present == "Late-In" || sD.present == "Present") {
                        let student = await studentRef.doc(its).get();

                        if (student.exists) {
                            let grade = student.data().gradeNum[0];
                            gradeCounts[grade].count++;
                            if (student.data().gender == "Male") {
                                gradeCounts[grade].male++;
                            } else {
                                gradeCounts[grade].female++;
                            }
                            if (student.data().allergies != "None") {
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
                    if (index == snapshot.size) {
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

router.get("/gradeDayAttendanceReport", headMAuth, async (req, res) => {
    try {
        const grade = req.body.grade
        const date = req.body.date

        let snapshot = await attendanceRef.where("date", "==", date).get()

        if (snapshot.empty) {
            throw new Error("No attendance records for day")
        }

        studentsList = []
        let index = 0
        await new Promise((resolve => {
            snapshot.forEach(async (s) => {
                try {
                    let sD = s.data()
                    let its = sD.its
                    let status = sD.present
                    let student = await studentRef.doc(its).get();

                    if (student.exists) {
                        if (student.data().grade === grade) {
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
                    if (index == snapshot.size) {
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


router.get("/staff/getStudentProfile", headMAuth, async (req, res) => {
    try {
        let its = req.body.its;
        let student = await studentRef.doc(its).get();
        let studentData = {}

        if (student.exists) {
            studentData = student.data()
            delete studentData.firstName
            delete studentData.lastName
            delete studentData.attendanceClass

        } else {
            res.send("No student found")
        }

        res.send(studentData)
    } catch (error) {
        res.send(error.toString())
    }
})

router.get("/getTeacherAvailability", headMAuth, async (req, res) => {
    try {
        let availability = {}

        let snapshot = await staffRef.where('role', 'array-contains-any', ['teacher', 'attendanceT', 'headM']).get()

        if (snapshot.empty) {
            throw new Error("No teachers found")
        }

        for (let i = 1; i <= 7; i++) {
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
                if (c.class.name === "Free") {
                    availability[period].available.push(name)
                } else if (c.class.name === "None") {
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

router.post("/addStudent", headMAuth, async (req, res) => {
    try {
        let student = req.body.student

        let familyId = student.family
        let snapshot = await familyRef.doc(familyId).get()
        if (snapshot.exists) {
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
        if (snapshot.exists) {
            let data = snapshot.data()
            student.attendanceClass = data
        } else {
            throw new Error("Class does not exist")
        }

        Student(student, (err) => {
            if (!err) {
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

router.get("/staff/staffAttendanceList", headMAuth, async (req, res) => {
    try {
        let attendanceStaffRef = staffRef.where('role', 'array-contains-any', ['teacher', 'attendanceT', 'headM']);
        let snapshot = await attendanceStaffRef.get();
        if (snapshot.empty) {
            throw new Error("No teachers found");
        }

        staffList = []
        let index = 0
        await new Promise((resolve => {
            snapshot.forEach(async (s) => {
                try {
                    let sD = s.data()
                    let date = new Date().toISOString().split("T")[0]
                    let searchKey = date + ":" + sD.its
                    let pres = await staffAttendanceRef.doc(searchKey).get();
                    let presentStatus = null;

                    if (pres.exists) {
                        presentStatus = pres.data().present
                    }
                    let sData = {
                        fullName: sD.name,
                        its: sD.its,
                        present: presentStatus
                    }
                    staffList.push(sData)
                } catch (err) {
                    throw err;
                } finally {
                    index += 1
                    if (index == snapshot.size) {
                        resolve();
                    }
                }
            })
        }))


        res.send(staffList)

    } catch (error) {
        res.status(502).send(error.toString());
    }
})

router.post("/staff/submitStaffAttendance", headMAuth, async (req, res) => {
    try {
        req.body.attendanceList.forEach((r) => {
            let date = new Date().toISOString().split("T")[0]
            let searchKey = date + ":" + r.its
            attendanceRecord = {
                date: date,
                its: r.its,
                present: r.present,
                informed: r.informed ? r.informed : "",
                reasonOfAbsence: r.reasonOfAbsence ? r.reasonOfAbsence : ""
            }
            StaffAttendance(attendanceRecord, (err) => {
                if (!err) {
                    staffAttendanceRef.doc(searchKey).set(attendanceRecord)
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

router.get("/staffAttendanceReport", headMAuth, async (req, res) => {
    try {
        const date = req.body.date

        let snapshot = await staffAttendanceRef.where("date", "==", date).get()

        if (snapshot.empty) {
            throw new Error("No staff attendance records for day")
        }

        staffList = []
        let index = 0
        await new Promise((resolve => {
            snapshot.forEach(async (s) => {
                try {
                    let sD = s.data()
                    let its = sD.its
                    let status = sD.present
                    let staff = await staffRef.doc(its).get();

                    if (staff.exists) {
                        let staffRecord = {
                            its: its,
                            name: staff.data().name,
                            status: status,
                            reasonOfAbsence: sD.reasonOfAbsence ? sD.reasonOfAbsence : ""
                        }
                        staffList.push(staffRecord)
                    }

                } catch (err) {
                    throw err;
                } finally {
                    index += 1
                    if (index == snapshot.size) {
                        resolve();
                    }
                }
            })
        }))

        res.send(staffList)

    } catch (error) {
        res.send(error.toString())
    }
})

module.exports = router;