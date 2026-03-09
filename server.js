const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

/* =========================
   MongoDB Connection
========================= */

mongoose.connect(
"mongodb+srv://vasanth_bharath:vasanth_bharath@cluster0.zxizqmj.mongodb.net/chatbotDB?retryWrites=true&w=majority"
)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


/* =========================
   Models
========================= */

const User = mongoose.model("User",{
username:String,
password:String
});

const Chat = mongoose.model("Chat",{
username:String,
message:String,
reply:String
});


/* =========================
   Create Default Admin
========================= */

async function createAdmin(){

const admin = await User.findOne({username:"admin"});

if(!admin){

await User.create({
username:"admin",
password:"admin123"
});

console.log("Default admin created");

}

}

createAdmin();


/* =========================
   Routes
========================= */

// Homepage
app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"public/login.html"));
});


// Login
app.post("/login", async(req,res)=>{

try{

const user = await User.findOne({
username:req.body.username,
password:req.body.password
});

if(user){
res.send("success");
}else{
res.send("fail");
}

}catch(err){
console.log(err);
res.send("fail");
}

});


// Chatbot
app.post("/chat", async(req,res)=>{

let msg = req.body.message.toLowerCase();
let reply = "I don't understand";

if(msg.includes("hello"))
reply = "Hello! 👋";

else if(msg.includes("name"))
reply = "I am a simple chatbot";

else if(msg.includes("help"))
reply = "How can I help you?";

try{

await Chat.create({
username:"admin",
message:req.body.message,
reply:reply
});

}catch(err){
console.log(err);
}

res.send(reply);

});


// Chat history
app.get("/history", async(req,res)=>{

try{

const chats = await Chat.find();
res.json(chats);

}catch(err){

res.json([]);

}

});


/* =========================
   Server
========================= */

app.listen(PORT,()=>{
console.log("Server running on port " + PORT);
});