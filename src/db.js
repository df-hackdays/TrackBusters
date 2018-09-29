const mongoose = require('mongoose');

const uri = "mongodb+srv://clc:clcuser2018@db-4yfv6.mongodb.net/clc?retryWrites=true";

const userSchema = new mongoose.Schema({ username: 'string', password: 'string', email: 'string', firstname: 'string', lastname: 'string', participantIds: [{id: 'string'}], avatar: 'string', status: 'string' });
const user = mongoose.model('user', userSchema);

mongoose.connect(uri);

var signup = function (username, password, email, survey){
  var newUser = new user({ username: username, password: password, email: email, firstname: 'test', lastname: 'test', participantIds: [], avatar: 'default', status: 'active' });
  newUser.save(function(err){
    if(err) return err;
  });
}
