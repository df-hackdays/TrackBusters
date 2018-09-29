const mongoose = require('mongoose');

const uri = "mongodb+srv://clc:clc2018@db-4yfv6.mongodb.net/test?retryWrites=true";

const userSchema = new mongoose.Schema({ username: 'string', password: 'string', email: 'string', id: 'objectId', participantIds: [id: 'string'], avatar: 'string', status: 'string' });
const User = mongoose.model('user', userSchema);

mongoose.connect(uri);
