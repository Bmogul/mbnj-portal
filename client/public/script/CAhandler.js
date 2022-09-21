const classAttendanceTab = document.getElementById('ClassAttendance')
const dropdown = document.getElementById('classesDropdown')
const studentsDiv = document.getElementById('studentsCA')
const students = studentsDiv.hasChildNodes ? studentsDiv.childNodes : null;

// make request for class data available to teachers
// currently dummy data
const classes = ['Salesa', 'Awala', 'Saniya'];
// get default cclass from db
// dummy data
const defaultClass = 'Salesa'

const salesa = [
    {
        fName: "Murtaza",
        lName: "Neemuchwala",
        its: 0,
        present: false
    },
    {
        fName: "Husain",
        lName: "Attarwala",
        its: 1,
        present: false
    },
    {
        fName: "Taher",
        lName: "Afini",
        its: 2,
        present: false
    },
    {
        fName: "Burhanuddin",
        lName: "Mogul",
        its: 3,
        present: false
    }
]

const awala = [
    {
        fName: "Moiz",
        lName: "Husain",
        its: 4,
        present: false
    },
    {
        fName: "Mohammed",
        lName: "Attarwala",
        its: 5,
        present: false
    },
    {
        fName: "Qasim",
        lName: "Nagar",
        its: 6,
        present: false
    },
]

const saniya = [
    {
        fName: "Mustansir",
        lName: "Neemuchwala",
        its:7,
        present: false
    },
    {
        fName: "Husain",
        lName: "Kapadia",
        its:8,
        present: false
    },
    {
        fName: "Mansoor",
        lName: "Kanchwala",
        its:9,
        present: false
    },
    {
        fName: "Imran",
        lName: "Danish",
        its:10,
        present: false
    },
    {
        fName:"Mohammed",
        lName:"Khambati",
        its:11,
        present:false
    }
]

// populate dropdown
classes.forEach(className => {
    let option = document.createElement('option')
    option.value = className;
    option.innerHTML = className;
    dropdown.appendChild(option)
})
dropdown.value='Salesa'
loadClass(dropdown)

function loadClass(element) {
    // retrive members of class here from db
    // dummy data for now
    // console.log(ele)
    let child = studentsDiv.lastElementChild; 
    while (child) {
        studentsDiv.removeChild(child);
        child = studentsDiv.lastElementChild;
    }
    if(element.value == 'default')
        return;
    let classMembers = null;
    if(element.value == "Salesa")
        classMembers = salesa;
    if(element.value == "Saniya")
        classMembers = saniya;
    if(element.value == "Awala")
        classMembers = awala;
    classMembers.forEach(student => {
        let studentDiv = document.createElement('div')
        studentDiv.className = "studentCA default"

        let sName = document.createElement('h2')
        sName.innerHTML = student.fName+"<br/>"+student.lName
        studentDiv.appendChild(sName)

        let form = document.createElement('form')
        studentDiv.appendChild(form)

        let labelP = document.createElement('label')
        labelP.innerHTML = 'Present:'
        form.appendChild(labelP)

        let inputP = document.createElement('input')
        inputP.type ='radio'; inputP.name="attendance"; inputP.value="present"; inputP.onclick=presentA;
        form.appendChild(inputP)

        form.appendChild(document.createElement('br'))

        let labelA = document.createElement('label')
        labelA.innerHTML = 'Absent:'
        form.appendChild(labelA)

        let inputA = document.createElement('input')
        inputA.type ='radio'; inputA.name="attendance"; inputA.value="absent"; inputA.onclick=absentA;
        form.appendChild(inputA)       
        
        studentsDiv.appendChild(studentDiv)
    })
}

function presentA() {
    this.parentNode.parentNode.className = "studentCA present"
}

function absentA() {
    this.parentNode.parentNode.className = "studentCA absent"
}

function markAllP() {
    students.forEach(student => {
        if (student.nodeType == Node.ELEMENT_NODE) {
            let child = student.childNodes[1].childNodes[1]
            child.checked = true;
            child.parentNode.parentNode.className = "studentCA present"
        }
    })
}
function markAllA() {
    students.forEach(student => {
        if (student.nodeType == Node.ELEMENT_NODE) {
            let child = student.childNodes[1].childNodes[4]
            child.checked = true;
            child.parentNode.parentNode.className = "studentCA absent"
        }
    })
}