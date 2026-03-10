require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

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
.catch(err=>console.log("MongoDB Error:",err));


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
console.log("Admin creation error:",err);
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
console.log("Login error:",err);
res.send("fail");
}

});


// AI Chatbot
app.post("/chat", async (req, res) => {

try {

const message = req.body.message;

const completion = await groq.chat.completions.create({
messages: [
{ role: "system", content: "You are a helpful AI chatbot." },
{ role: "user", content: message }
],
model: "llama3-8b-8192"
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

const chats = await Chat.find().sort({_id:-1});
res.json(chats);

}catch(err){

console.log("History error:",err);
res.json([]);

}

});


/* =========================
   Server
========================= */

app.listen(PORT,()=>{
console.log("Server running on port " + PORT);
});
