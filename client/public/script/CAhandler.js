const classAttendanceTab = document.getElementById('ClassAttendance')
const studentsDiv = document.getElementById('studentsCA')
const students = studentsDiv.hasChildNodes ? studentsDiv.childNodes : null;

studentsDiv.addEventListener("click", e => {
    console.log("HELLo")
})

function presentA(element){
    console.log(element.parentNode.parentNode.className)
    element.parentNode.parentNode.className = "studentCA present"
}

function absentA(element){
    element.parentNode.parentNode.className = "studentCA absent"
}

function markAllP(element){
    students.forEach(student =>{
        if(student.nodeType == Node.ELEMENT_NODE){
            let child = student.childNodes[3].childNodes[3]
            child.checked = true;
            presentA(child)          
            // console.log(child.checked)
        }
    })
}
function markAllA(element){
    students.forEach(student =>{
        if(student.nodeType == Node.ELEMENT_NODE){
            let child = student.childNodes[3].childNodes[9]
            child.checked = true;
            absentA(child)          
            // console.log(child)
        }
    })
}