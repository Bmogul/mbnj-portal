// Permissions will be retrived from db
// Permissions will be as follows
    // Class teacher: class attendance tab for their class
        // class attendace and class history for their current class
    // Teacehr: 
        // Schedule Absence only
    // Attendance: class attendance for assigned class/s
        // class attendace for assigned class/s
    // Office Staff: 
        // Student lookup for all students, Read only
        // Class history for all classes
    // Head Moalim: 
        // All pages, R / W permissions
    // Admin:
        // All pages, R / W permissions
const permissions = {
    teacher:{
        classAttendace:false,
        studentLookup:false,
        scheduleAbsence:true,
        classHistory:false
    },
    classTeacher:{
        classAttendace:true,
        studentLookup:true,
        scheduleAbsence:true,
        classHistory:true
    },
    attendanceTeacher:{
        classAttendace:true,
        studentLookup:false,
        scheduleAbsence:true,
        classHistory:false
    },
    officeStaff:{
        classAttendace:true,
        studentLookup:true,
        scheduleAbsence:true,
        classHistory:true
    },
    headMoalim:{
        classAttendace:true,
        studentLookup:true,
        scheduleAbsence:true,
        classHistory:true
    },
    Admin:{
        classAttendace:true,
        studentLookup:true,
        scheduleAbsence:true,
        classHistory:true
    }
}