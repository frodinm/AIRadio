require("dotenv").config();
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var cors = require("cors");
var http = require("http");
var socketio = require("socket.io");

var logger = require("morgan");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");

//AylienText
// var AYLIENTextAPI = require("aylien_textapi");
// var textapi = new AYLIENTextAPI({
//   application_id: "658f3ba4",
//   application_key: "e2b8dbac16bd83dcae95662206c50a15"
// });

// johnny - five;
// var five = require("johnny-five"),
//   board = new five.Board();

var app = express();
app.use(cors());
app.use(
  logger(
    "[:date[iso]] :method :url :status :response-time ms - :res[content-length]"
  )
);

var server = http.Server(app);
var websocket = socketio(server);

var mongoose = require("mongoose");
var dbName = "AIRadio";

var indico = require("indico.io");
indico.apiKey = "443998e820c54357e3e65e8b5dd38e7c";

var response = function(res) {
  console.log(res);
};
var logError = function(err) {
  console.log(err);
};

console.log("Connecting to database " + dbName);

mongoose.connect(
  "mongodb://localhost:" + (process.env.DB_PORT || "27017") + "/" + dbName
);

var models = require("./rest/models/_models");
var genericControllers = require("./rest/controllers/_genericController");
var specificControllers = require("./rest/controllers/_specificControllers");

const writable = process.env.writable === "true" || true;

console.log("AIRadio Database");
console.log("Initializing ...");
console.log("Throwing in some middlewares .... ");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "uwotm8"
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("json spaces", 2);

let Members = models["members"];

passport.use(
  new LocalStrategy(function(username, password, done) {
    Members.findOne({ username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      } else {
        bcrypt.compare(password, user.userPassword(), function(err, res) {
          if (err) return done(null, false, { message: err });
          if (res === false) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        });
      }
    });
  })
);

passport.serializeUser(Members.serializeUser());
passport.deserializeUser(Members.deserializeUser());

for (var model in models) {
  console.log("Registering model : " + model);
  app.use(
    "/json/" + model + "/",
    genericControllers.createRouter(model, models[model], writable, "json")
  );
}

app.use(
  "/member/",
  specificControllers.memberController(
    "members",
    models["members"],
    writable,
    "json"
  )
);

//Lets launch the service!
server.listen(process.env.PORT || 5000, () => {
  console.log(
    `------ Server is running on port ${process.env.PORT || 5000} ------`
  );
});

websocket.on("connection", socket => {
  console.log("a user connected");

  socket.emit("connection", "hello");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  //on receive text input
  socket.on("text", text => {
    console.log(text);
    // text =
    //   'Why would Kim Jong-un insult me by calling me "old," when I would NEVER call him "short and fat?" Oh well, I try so hard to be his friend - and maybe someday that will happen!';
    if (text) {
      console.log("received text:", text);

      //personality
      indico
        .personality(text)
        .then(response => {
          console.log("personality", response);
        })
        .catch(logError);

      //personas
      indico
        .personas(text)
        .then(response => {
          console.log("personas", response);
        })
        .catch(logError);

      //emotion
      indico
        .emotion(text)
        .then(response => {
          console.log("emotion", response);
          // let anger = response.anger;
          // let joy = response.joy;
          // let fear = response.fear;
          // let sadness = response.sadness;
          // let surprise = response.surprise;

          // board.on("ready", function() {
          //   // Create an Led on pin 13
          //   let redLed = new five.Led([7, 10, 13]);
          //   let greenLed = new five.Led([11, 8, 5]);
          //   let yellowLed = new five.Led([12, 9, 6]);

          //   // Strobe the pin on/off, defaults to 100ms phases
          //   led.strobe();
          // });
        })
        .catch(logError);

      //political
      indico
        .political(text)
        .then(response => {
          console.log("political", response);
        })
        .catch(logError);

      // textapi.sentiment(
      //   {
      //     text: "John is a very good football player!"
      //   },
      //   (error, response) => {
      //     if (error === null) {
      //       console.log(response);
      //     }
      //   }
      // );
    } else {
      console.log("No text received");
    }
  });

  //on receive image input
  socket.on("image", image => {
    if (image) {
      // console.log("received image", image);

      //emotion
      indico
        .fer(image)
        .then(response => {
          console.log(response);
        })
        .catch(logError);

      // indico
      //   .imageRecognition(image)
      //   .then(response => {
      //     console.log(response);
      //   })
      //   .catch(logError);
    } else {
      console.log("no image received");
    }
  });
});
