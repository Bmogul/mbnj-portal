// function logout(){
//     fetch('/staff/logut', {
//         method:'POST',
//         headers:{
//             'Authorization': sessionStorage.getItem('login_token')
//         },
//     }).then(status =>{
//         status.json().then(data => {
//             console.log(data)
//     })}).catch(e =>{
//         console.log('ERROR', e)
//     })
//     sessionStorage.removeItem("login_token")
// }

// let token = sessionStorage.getItem('login_token')
// if(!token){
//     // Testing purpouses, remove codde once done
//     // sessionStorage.setItem('login_token', 3902423343)
//     // document.location.href='./pages/portal.html'
//     // uncomment code once done working on portal page
//     document.location.href = './login.html'
// }