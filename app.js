const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/UserDB", { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", userSchema);

const app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/",function(req,res){
   res.render("home");
});

app.get("/register",function(req,res){
   res.render("register");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/register",function(req,res){

    User.findOne({username:req.body.email} , function(err,foundUser){
         if(err){
             console.log(err);
         }else if(foundUser){
             res.send("<h1> User already exist. Please login</h1>");
         }else{
             const user = new User({
                 username: req.body.email,
                 password: req.body.password
             });

             user.save(function (err) {
                 if (err) {
                     console.log(err);
                 } else {
                     res.render("inside");
                 }
             });
         }
    });


});

app.post("/login",function(req,res){
    User.findOne({ username: req.body.email }, function (err, foundUser) {
        if(err){
            console.log(err);
        }else if(foundUser){
            if (req.body.password === foundUser.password) {
                res.render("inside");
            } else {
                res.redirect("/login");
            }
        }else{
            res.send("<h1> User Not found </h1>");
        }
        
     });
});



app.listen(3000,function(){
 console.log("on port 3000...");
});