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
        classAttendace:true,    // read only
        studentLookup:false,
        scheduleAbsence:true,   // no export history
        classHistory:false
    },
    classTeacher:{
        classAttendace:true,    // only their main class or assigned classes
        studentLookup:true,     // only their students
        scheduleAbsence:true,   // no export history
        classHistory:true       // only their class
    },
    officeStaff:{
        classAttendace:true,    // Read Write for all classes
        studentLookup:true,     // Lookup all students
        scheduleAbsence:true,   // export report maybe?
        classHistory:true       // all classes
    },
    headMoalim:{
        classAttendace:true,    // Read Write for all classes
        studentLookup:true,     // Lookup all students, Edit student data
        scheduleAbsence:true,   // export report for staff atendance
        classHistory:true       // all classes
    },
    Admin:{
        classAttendace:true,    // Read Write for all classes
        studentLookup:true,     // Lookup all students, Edit student data
        scheduleAbsence:true,   // export report for staff attendance
        classHistory:true       // all classes
    }
}
// retrive permission level from db 
const permission = 'Admin'
const currentPermissions = permissions[permission]
// console.log(currentPermissions)

const tabsDiv = document.getElementById('tab-div')
const tabContentDiv = document.getElementById('tabs')

if(currentPermissions.classAttendace){
    let tab = document.createElement('button')
    tab.className = 'tablinks active'
    tab.innerHTML = 'Class<br/>Attendance'
    tabsDiv.appendChild(tab)

    let tabContent = document.createElement('div')
}
if(currentPermissions.studentLookup){
    let tab = document.createElement('button')
    tab.className = 'tablinks'
    tab.innerHTML = 'Student<br/>Lookup'
    tabsDiv.appendChild(tab)
}
if(currentPermissions.scheduleAbsence){
    let tab = document.createElement('button')
    tab.className = 'tablinks'
    tab.innerHTML = 'Schedule<br/>Absence'
    tabsDiv.appendChild(tab)
}
if(currentPermissions.classHistory){
    let tab = document.createElement('button')
    tab.className = 'tablinks'
    tab.innerHTML = 'Class<br/>History'
    tabsDiv.appendChild(tab)
}