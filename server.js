const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

/* =========================
   OpenAI Setup
========================= */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

try{

const admin = await User.findOne({username:"admin"});

if(!admin){

await User.create({
username:"admin",
password:"admin123"
});

console.log("Default admin created");

}

}catch(err){
console.log(err);
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


// AI Chatbot
app.post("/chat", async (req, res) => {

try {

const message = req.body.message;

const completion = await openai.chat.completions.create({
model: "gpt-4.1-mini",
messages: [
{ role: "system", content: "You are a helpful AI chatbot." },
{ role: "user", content: message }
]
});

const reply = completion.choices[0].message.content;

await Chat.create({
username: "admin",
message: message,
reply: reply
});

res.send(reply);

} catch (err) {

console.log(err);
res.send("AI error");

}

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