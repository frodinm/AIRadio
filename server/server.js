require('dotenv').config();
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var app = express();
app.use(cors());
app.use(logger('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));


var mongoose = require('mongoose');
var dbName = 'AIRadio';

console.log('Connecting to database ' + dbName);

mongoose.connect('mongodb://localhost:' + (process.env.DB_PORT || '27017') + '/' + dbName);

var models = require('./rest/models/_models');
var genericControllers  = require('./rest/controllers/_genericController');
var specificControllers = require('./rest/controllers/_specificControllers');

const writable = process.env.writable === 'true' || true;

console.log('AIRadio Database');
console.log('Initializing ...');
console.log('Throwing in some middlewares .... ');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({ resave: true, saveUninitialized: true, 
    secret: 'uwotm8' }));
app.use(passport.initialize());
app.use(passport.session());

app.set('json spaces', 2);

let Members = models['members'];

passport.use(new LocalStrategy(
    function(username, password, done) {
      Members.findOne({ username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }else{
            bcrypt.compare(password, user.userPassword(), function(err, res) {
                if (err) return done(null,false,{message: err});
                if (res === false) {
                  return done(null, false);
                } else {
                  return done(null, user);
                }
              });
        }
      });
    }
));

passport.serializeUser(Members.serializeUser());
passport.deserializeUser(Members.deserializeUser());


for(var model in models){
    console.log('Registering model : ' + model);
    app.use('/json/'+model+'/', genericControllers.createRouter(model, models[model], writable, 'json'));
}

app.use('/member/', specificControllers.memberController('members',models['members'],writable,'json'));


//Lets launch the service!
app.listen(process.env.PORT || 5000, () => {
    console.log('------ Server is running on port 5000! ------');
});