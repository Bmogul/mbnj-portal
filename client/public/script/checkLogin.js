let token = sessionStorage.getItem('login_token')
if(!token){
    document.location.href = './pages/login.html'
}else{
    document.location.href = './pages/portal.html'
}