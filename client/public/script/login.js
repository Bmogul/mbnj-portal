// import validator from 'validator'

let token = sessionStorage.getItem('login_token')
if(token){
    document.location.href = './portal.html'
}

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
    if(!psswd.value || psswd.value.length < 8 || !/[A-Z]/.test(psswd.value)){
        alert('Please input a valid Password')
        return false;
    }
    return true;
}

submit.onclick = () =>{
    // if valid inputs
    if(validate()){
        // check to see if in db and get login token
        sessionStorage.setItem('login_token', 12804982);
        return true;
    }else{
        return false;
    }
}