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
    },
    class:{
        classAttendace:true,    // Read Write for all classes
        studentLookup:false,     // Lookup all students, Edit student data
        scheduleAbsence:false,   // export report for staff attendance
        classHistory:false  
    },
    lookup:{
        classAttendace:false,    // Read Write for all classes
        studentLookup:true,     // Lookup all students, Edit student data
        scheduleAbsence:false,   // export report for staff attendance
        classHistory:false  
    },
    absence:{
        classAttendace:false,    // Read Write for all classes
        studentLookup:false,     // Lookup all students, Edit student data
        scheduleAbsence:true,   // export report for staff attendance
        classHistory:false  
    },
    history:{
        classAttendace:false,    // Read Write for all classes
        studentLookup:false,     // Lookup all students, Edit student data
        scheduleAbsence:false,   // export report for staff attendance
        classHistory:true  
    }
}
// retrive permission level from db 
const permission = 'teacher'
const currentPermissions = permissions[permission]
// console.log(currentPermissions)

const tabsDiv = document.getElementById('tab-div')
const tabContentDiv = document.getElementById('tabs')
const attendaceTab = document.getElementById('ClassAttendance')
const lookupTab = document.getElementById('StudentLookup')
const absenceTab = document.getElementById('ScheduleAbsence')
const historyTab = document.getElementById('ClassHistory')
//temp code, dfault will bre retirved from db
let defaultTab = null

if(currentPermissions.classAttendace){
    let tab = document.createElement('button')
    tab.className = 'tablinks active'
    tab.innerHTML = 'Class<br/>Attendance'
    tab.onclick = openAttendance
    tabsDiv.appendChild(tab)
    defaultTab = attendaceTab
}
if(currentPermissions.studentLookup){
    let tab = document.createElement('button')
    tab.className = 'tablinks'
    tab.innerHTML = 'Student<br/>Lookup'
    tab.onclick = openLookup
    tabsDiv.appendChild(tab)
    if(!defaultTab){
        defaultTab = lookupTab
        tab.click()
    }
        
}
if(currentPermissions.scheduleAbsence){
    let tab = document.createElement('button')
    tab.className = 'tablinks'
    tab.innerHTML = 'Schedule<br/>Absence'
    tab.onclick = openAbsence
    tabsDiv.appendChild(tab)
    if(!defaultTab){
        defaultTab = lookupTab
        tab.click()
    }
}
if(currentPermissions.classHistory){
    let tab = document.createElement('button')
    tab.className = 'tablinks'
    tab.innerHTML = 'Class<br/>History'
    tab.onclick = openHistory
    tabsDiv.appendChild(tab)
    if(!defaultTab){
        defaultTab = lookupTab
        tab.click()
    } 
}
attendaceTab.style.display='none'
lookupTab.style.display='none'
absenceTab.style.display='none'
historyTab.style.display='none'
defaultTab.style.display='block'

function openAttendance(){
    tabsDiv.childNodes.forEach(tab => {
        if(tab.nodeType == Node.ELEMENT_NODE)
            tab.className = 'tablinks'
    })
    this.className = 'tablinks active';
    attendaceTab.style.display='block'
    lookupTab.style.display='none'
    absenceTab.style.display='none'
    historyTab.style.display='none'
}
function openLookup(){
    tabsDiv.childNodes.forEach(tab => {
        if(tab.nodeType == Node.ELEMENT_NODE)
            tab.className = 'tablinks'
    })
    this.className = 'tablinks active';
    attendaceTab.style.display='none'
    lookupTab.style.display='block'
    absenceTab.style.display='none'
    historyTab.style.display='none'
}
function openAbsence(){
    tabsDiv.childNodes.forEach(tab => {
        if(tab.nodeType == Node.ELEMENT_NODE)
            tab.className = 'tablinks'
    })
    this.className = 'tablinks active';
    attendaceTab.style.display='none'
    lookupTab.style.display='none'
    absenceTab.style.display='block'
    historyTab.style.display='none'
}
function openHistory(){
    tabsDiv.childNodes.forEach(tab => {
        if(tab.nodeType == Node.ELEMENT_NODE)
            tab.className = 'tablinks'
    })
    this.className = 'tablinks active';
    attendaceTab.style.display='none'
    lookupTab.style.display='none'
    absenceTab.style.display='none'
    historyTab.style.display='block'
}

