

const loginForm = document.getElementById('loginForm');
const submit = document.getElementById('submitBtn');
let uname = document.getElementById('its');
const psswd = document.getElementById('psswd');

let email = false;

const page = window.location.pathname.split("/").pop();
if(page == 'parentlogin.html'){
    uname = document.getElementById('email')
    email = true;
}
const validate = ()=>{
    if(email){
        if(!uname.value ){
            alert('Please input valid Email')
            return false;
        }
    }
    else{
        if(!uname.value || !/^[0-9]{8}$/.test(uname.value)){
            alert('Please input a valid ITS')
            return false;
        }
    }
    if(!psswd.value){
        alert('Please input a valid Password')
        return false;
    }
    return true;
}

submit.onclick = () =>{
    // if valid inputs
    if(validate()){
        // check to see if in db and get login token
        validLogin = false;
        fetch('/staff/login', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({its:uname.value,password:psswd.value})
        }).then(status =>{
            status.json().then(data => {   
                console.log(data)
                alert('allGOOD')
                sessionStorage.setItem('login_token', data.token) 
                validLogin = true; 
        })}).catch(e =>{
            console.log('ERROR', e)
        })
        console.log(validLogin)
        alert('Logged in')
        return false;
    }else{
        alert("Invalid Login Credentials")
        return false;
    }
}