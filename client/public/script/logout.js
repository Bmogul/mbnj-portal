function logout(){sessionStorage.removeItem("login_token")}

let token = sessionStorage.getItem('login_token')
if(!token){
    // Testing purpouses, remove codde once done
    // sessionStorage.setItem('login_token', 3902423343)
    // document.location.href='./pages/portal.html'
    // uncomment code once done working on portal page
    document.location.href = './login.html'
}