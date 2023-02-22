// import validator from 'validator'

// const { stubString } = require("lodash");

let token = sessionStorage.getItem('login_token')
// if(token){
//     document.location.href = './portal.html'
// }

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

submit.onclick = () =>{

        fetch('/staff/login', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({its:uname.value,password:psswd.value})
        }).then(status =>{
            status.json().then(data => {   
                console.log(data, status)
                if(data.error){
                    throw new Error(data.error);
                }
                alert("ALL GOOD")
                sessionStorage.setItem('login_token', data.token) 
            // Once login token is stored, make a request to access portal page
            fetch('/portal', {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('login_token')
                }
            }).then(res => res.text())
            .then(html => {
                console.log(html)
            }).catch(e=>console.log(e))
        }).catch(e=>{
            alert(e.toString().substring(14))
        })}).catch(e =>{
        })
        return false;
}