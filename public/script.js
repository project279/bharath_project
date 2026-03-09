function login(){

let username=document.getElementById("username").value
let password=document.getElementById("password").value

fetch("/login",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username:username,
password:password
})

})

.then(res=>res.text())
.then(data=>{

if(data=="success"){
localStorage.setItem("user",username)
window.location="dashboard.html"
}
else{
alert("Invalid login")
}

})

}

function send(){

let msg=document.getElementById("msg").value

fetch("/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
message:msg
})

})

.then(res=>res.text())
.then(reply=>{

let chat=document.getElementById("chatbox")

chat.innerHTML += "<p><b>You:</b> "+msg+"</p>"
chat.innerHTML += "<p><b>Bot:</b> "+reply+"</p>"

})

}

function logout(){

localStorage.removeItem("user")
window.location="login.html"

}