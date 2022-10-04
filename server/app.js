require('dotenv').config()
const express = require("express")
const path = require('path')
db = require('./db/db.js')

const attendanceRouter = require('./routers/attendance')
const classRouter = require('./routers/class')
const familyRouter = require('./routers/family')
const gradeRouter = require('./routers/grade')
const parentRouter = require('./routers/parent')
const staffRouter = require('./routers/staff')
const staffAttendanceRouter = require('./routers/staffAttendance')
const studentRouter = require('./routers/student')

const app = express();
const port = process.env.PORT || 3001;

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-headers", "Origins, X-Requested-With, Content-Type, Accept, Authorization")
    next()
})
console.log(__dirname)
app.use(express.static('../client/public'));
app.use(express.json())
// app.use(eventRouter)

app.use(attendanceRouter)
app.use(classRouter)
app.use(familyRouter)
app.use(gradeRouter)
app.use(parentRouter)
app.use(staffRouter)
app.use(staffAttendanceRouter)
app.use(studentRouter)


app.get('/', function(req,res){
    res.sendFile(__dirname + '/../client/public/index.html')
})

app.listen(port, () => {
    console.log("Listening on port 3001.");
})