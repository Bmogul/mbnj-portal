const express = require('express');
const router = new express.Router();

const Attendance = require('../models/attendance');
const attendanceRef = db.collection('attendance');

module.exports = router;