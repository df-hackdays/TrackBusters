// Should split server logic and dao logic

const mongoose = require('mongoose');

const uri = "mongodb+srv://clc:clcuser2018@db-4yfv6.mongodb.net/clc?retryWrites=true";

// seperate password from this table
const userSchema = new mongoose.Schema({ username: 'string', password: 'string', email: 'string', fullname: 'string', gender: 'string', dateofbirth: 'date', zip: 'string', race: 'string', avatar: 'string', status: 'string' , signuptime: 'date', school: 'string', grade: 'string', hopetostart: 'string', interest: 'string', desc: 'string', complete: 'boolean'});
const user = mongoose.model('user', userSchema);
const eventSchema = new mongoose.Schema({name: 'string', contents: [{title: 'string', content: 'string'}], type: 'string', startDate: 'date', endDate: 'date', location: 'string', status: 'string', registered: [{id:'string'}], participated: [{id:'string'}]});
const event = mongoose.model('event', eventSchema);

mongoose.connect(uri);

var signup = function (newUser, req, res){
  newUser.save(function(err){
    if(err) {
      res.render("signup", {
        error: "Error"
      });
    }else{
      var sessData = req.session;
      var newUser = sessData.newUser;
      var recommended = recommendEvent(currentUser);
      user.findOne({ email: newUser.email }, function (err, currentUser) {
        res.render('main', {
          currentUser: currentUser,
          recommended: recommended,
          events: event.find({status: 'active'}).skip(0).limit(10).sort({startDate: -1})
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
  var email = req.body.email;
  var signupDate = Date.now();
  var newUser = new user();
  newUser.email = email;
  newUser.password = password;
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
  if(to.zip!=null){
    complete = true;
  }
  var newUser = new user({ username: to.username, password: to.password, email: to.email, fullname: to.fullname, gender: to.gender, dateofbirth: to.date, zip: to.zip, race: to.race, avatar: 'default', status: 'active' , signuptime: Date.now(), school: req.body.school, grade: req.body.grade, hopetostart: req.body.hopetostart, interest: req.body.interest, desc: req.body.desc, complete: complete});
  /* add validation*/
  signup(newUser, req, res);
});

app.get('/dashboard', (req, res)=>{
  var id = req.params.id;
  user.findById(id, (err, currentUser)=>{
    var recommended;
    if(currentUser.complete===true){
      recommended = recommendEvent(currentUser);
    }
    res.render('main', {
      currentUser: currentUser,
      recommended: recommended,
      events: event.find({status: 'active'}).skip(0).limit(10).sort({startDate: -1})
    });
  });
});

app.post("/login", (req, res)=>{
  var username = req.body.username;
  var password = req.body.password
  login(username, password, req, res);
});

app.listen(port, (error)=>{
  if(error){
    console.log(error);
  }else{
    console.log("Running on port "+port);
  }
});

var recommendEvent = function(cu){
  return null;
}
