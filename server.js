const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(express.json())
app.use(cors())

app.use(express.static("public"))

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URL)

const User = mongoose.model("User",{
username:String,
password:String
})

const Chat = mongoose.model("Chat",{
username:String,
message:String,
reply:String
})

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"public/login.html"))
})

app.post("/login", async(req,res)=>{

const user = await User.findOne({
username:req.body.username,
password:req.body.password
})

if(user){
res.send("success")
}else{
res.send("fail")
}

})

app.post("/chat", async(req,res)=>{

let msg=req.body.message.toLowerCase()
let reply="I don't understand"

if(msg.includes("hello"))
reply="Hello! 👋"

else if(msg.includes("name"))
reply="I am a simple chatbot"

else if(msg.includes("help"))
reply="How can I help you?"

await Chat.create({
username:"admin",
message:req.body.message,
reply:reply
})

res.send(reply)

})

app.get("/history", async(req,res)=>{

const chats=await Chat.find()
res.json(chats)

})

app.listen(PORT,()=>{
console.log("Server running")
})