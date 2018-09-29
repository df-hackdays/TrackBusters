// Should split server logic and dao logic

const mongoose = require('mongoose');

const uri = "mongodb+srv://clc:clcuser2018@db-4yfv6.mongodb.net/clc?retryWrites=true";

// seperate password from this table
const userSchema = new mongoose.Schema({ username: 'string', password: 'string', email: 'string', fullname: 'string', gender: 'string', dateofbirth: 'date', zip: 'string', race: 'string', avatar: 'string', status: 'string' , signuptime: 'date', school: 'string', grade: 'string', hopetostart: 'string', interest: 'string', desc: 'string', complete: 'boolean'});
const user = mongoose.model('user', userSchema);
const eventSchema = new mongoose.Schema({name: 'string', contents: [{title: 'string', content: 'string'}], type: 'string', cost: 'number' ,startDate: 'date', endDate: 'date', location: 'string', status: 'string', registered: [{id:'string'}], participated: [{id:'string'}]});
const event = mongoose.model('event', eventSchema);

mongoose.connect(uri);

// hash the password!
var signup = function (newUser, req, res){
  newUser.save(function(err){
    if(err) {
      console.log(err);
      res.render("signup", {
        error: "Error"
      });
    }else{
      var sessData = req.session;
      var newUser = sessData.newUser;
      user.findOne({ email: newUser.email }, function (err, currentUser) {
        console.log(err);
        sessData.currentUser = currentUser;
        var events;
        event.find({status: 'active'}, null, {skip:0, limit:10}, function(err, docs){
          res.render('main', {
            currentUser: currentUser,
            events: docs
          });
        });
      });
    }
  });
}

var login = function(email, password, req, res){
  user.find({email: email}, function(err, u){
    if(err) {
      res.render("login", {
        error: "Error"
      });
    }else{
      if(u.password === password){
        res.render("main");
      }else{
        res.render("login", {
          error: "Invalid Credentials"
        });
      }
    }
  });
}

const pug = require('pug');
const bcrypt = require('bcrypt');
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3001;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "static/views"));
app.use(express.static('static'));
app.use(session({ secret: 'aVerySafeToken', cookie: { maxAge: 60000 }}));
app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname, '/static/index.html'));
})

app.post("/signup", (req, res)=>{
  var password = req.body.password;
  bcrypt.hash(password, 10, function(err, hash) {
    if(err){
      console.log(err);
    }else{
      var email = req.body.email;
      var repw = req.body.repw;
      var signupDate = Date.now();
      var newUser = new user();
      newUser.email = email;
      newUser.password = hash;
      var sessData = req.session;
      sessData.newUser = newUser;
      /* replace with validation*/
      if(true){
        res.render('signup2');
      }else{
        res.render('signup', {
          error: error
        });
      }
    }
  });
});

app.post("/signup2", (req, res)=>{
  var sessData = req.session;
  var newUser = sessData.newUser;
  newUser.fullname = req.body.fullname;
  newUser.dateofbirth = req.body.dateofbirth;
  newUser.zip = req.body.zip;
  newUser.gender = req.body.gender;
  newUser.race = req.body.race;
  sessData.newUser = newUser;
  /* replace with validation*/
  if(true){
    res.render('signup3');
  }else{
    res.render('signup', {
      error: error
    });
  }
});

app.post('/signup3', (req, res)=>{
  var sessData = req.session;
  var to = sessData.newUser;
  var complete = false;
  if(to.zip!=null&&to.zip.trim()!=''){
    complete = true;
  }
  var newUser = new user({ username: to.username, password: to.password, email: to.email, fullname: to.fullname, gender: to.gender, dateofbirth: to.dateofbirth, zip: to.zip, race: to.race, avatar: 'default', status: 'active' , signuptime: Date.now(), school: req.body.school, grade: req.body.grade, hopetostart: req.body.hopetostart, interest: req.body.interest, desc: req.body.desc, complete: complete});
  /* add validation*/
  signup(newUser, req, res);
});

app.get('/dashboard', (req, res)=>{
  var id = req.params.id;
  user.findById(id, (err, currentUser)=>{
    var events;
    event.find({status: 'active'}, null, {skip:0, limit:10}, function(err, docs){
      res.render('main', {
        currentUser: currentUser,
        events: docs
      });
    });
  });
});

app.post("/login", (req, res)=>{
  var email = req.body.email;
  var password = req.body.password;
  var sessData = req.session;
  user.findOne({email: email}, (err, currentUser)=>{
    bcrypt.compare(password, currentUser.password, function(err, result) {
      if(err) {
        res.render('login', {error: "Invalid Credentials."});
      } else {
        sessData.currentUser = currentUser;
        event.find({status: 'active'}, null, {skip:0, limit:10}, function(err, docs){
          res.render('main', {
            currentUser: currentUser,
            events: docs
          });
        });
      }
    });
  });
});

app.get("/toggleLogin", (req, res)=>{
  res.render('login');
});

app.get("/toggleSignup", (req, res)=>{
  res.render('signup');
});

//  todo: implement admin user login, post
app.get("/admin", (req, res)=>{
  var events;
  event.find({}, function(err, docs){
    events = docs;
    res.render('adminMain', {
      events: docs
    });
  });
})

// sample analysis
app.get('/event/1337', (req, res)=>{
  event.findById("5bafa052d6d55e3cca8eb896", function(err, doc){
    var registeredIds = doc.registered;
    var participatedIds = doc.participated;
    var regCount = registeredIds.length;
    var parCount = participatedIds.length;
    var ids = [];
    for(var a = 0; a < registeredIds.length;a++){
      ids.push(registeredIds[a].id);
    }
    user.find({_id:{$in: ids}}, (err, users)=>{
      var regRace = {m: 0, nm: 0, un:0};
      var ages = [];
      for(var i = 0; i < users.length;i++){
        if(users[i].race==null||users[i].race==""){
          regRace.m++;
        }else if (users[i].race=="Caucasian") {
          regRace.nm++;
        }else{
          regRace.un++;
        }
        ages.push((new Date()).getFullYear()-users[i].dateofbirth.getFullYear());
      }
      var regAge = countAgeOccurance(ages);
      res.render('eventAnalysis', {
        event: doc, race: regRace, age: regAge, reg: regCount, par: parCount
      });
    });
  });
});

app.listen(port, (error)=>{
  if(error){
    console.log(error);
  }else{
    console.log("Running on port "+port);
  }
});

// todo: impelement recommendation
var recommendEvent = function(cu){
  var events;
  event.find({status: 'active'}, null, {skip:0, limit:1}, function(err, docs){
    events = docs;
  });
  return events;
};

var countAgeOccurance = function (arr) {
  return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
};
