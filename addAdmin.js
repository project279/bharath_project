const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://vasanth_bharath:vasanth_bharath@cluster0.zxizqmj.mongodb.net/?appName=Cluster0");

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  const admin = new User({
    username: "admin",
    password: "admin123"
  });

  await admin.save();
  console.log("Admin user created");
  mongoose.connection.close();
}

createAdmin();