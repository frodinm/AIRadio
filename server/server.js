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
// var board = new five.Boards(["/dev/cu.usbserial-DA00WSQJ"]);
//AylienText
// var AYLIENTextAPI = require("aylien_textapi");
// var textapi = new AYLIENTextAPI({
//   application_id: "658f3ba4",
//   application_key: "e2b8dbac16bd83dcae95662206c50a15"
// });

//johnny - five;
var five = require("johnny-five"),
  board = new five.Board("/dev/cu.usbserial-DA00WSQJ");

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

board.on("ready", function() {
  let allLed = [7, 10, 13, 6, 9, 12, 5, 8, 11];
  let ledArray = [];
  allLed.forEach(led => {
    ledArray.push(new five.Led(led));
  });

  let redLed = [0, 1, 2];
  let yellowLed = [3, 4, 5];
  let greenLed = [6, 7, 8];

  function type1(ledABC) {
    new Promise(resolve => {
      ledArray.forEach(led => {
        led.stop().off();
      });
      resolve();
    }).then(() => {
      var ledA = ledArray[ledABC[0]];
      var ledB = ledArray[ledABC[1]];
      var ledC = ledArray[ledABC[2]];

      ledA.blink(1000);

      setTimeout(() => {
        ledB.blink(1000);
      }, 333);

      setTimeout(() => {
        ledC.blink(1000);
      }, 666);
    });
  }
  function type2(ledABC) {
    new Promise(resolve => {
      ledArray.forEach(led => {
        led.stop().off();
      });
      resolve();
    }).then(() => {
      var ledA = ledArray[ledABC[0]];
      var ledB = ledArray[ledABC[1]];
      var ledC = ledArray[ledABC[2]];

      ledA.blink(500);
      ledB.blink(500);
      ledC.blink(500);
    });
  }

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
            let anger = response.anger;
            let joy = response.joy;
            let fear = response.fear;
            let sadness = response.sadness;
            let surprise = response.surprise;

            let emotions = [anger, joy, fear, sadness, surprise];
            let emotionNames = ["anger", "joy", "fear", "sadness", "surprise"];

            let highestEmotionValue = 0;
            let highestEmotion;
            for (let i = 0; i < 5; i++) {
              if (emotions[i] > highestEmotionValue) {
                highestEmotionValue = emotions[i];
                highestEmotion = emotionNames[i];
              }
            }

            console.log(highestEmotion);

            console.log("board ready");
            //functions according to emotions

            if (highestEmotion === "joy") {
              ledABC = greenLed;
              type1(ledABC);
            } else if (highestEmotion === "fear") {
              ledABC = yellowLed;
              type1(ledABC);
            } else if (highestEmotion === "sadness") {
              ledABC = redLed;
              type1(ledABC);
            } else if (highestEmotion === "surprise") {
              ledABC = yellowLed;
              type2(ledABC);
            } else if (highestEmotion === "anger") {
              ledABC = redLed;
              type2(ledABC);
            }
            var motor = new five.Motor(3);
            motor.start();
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
            let anger = response.Anger;
            let sad = response.Sad;
            let neutral = response.Neutral;
            let surprise = response.Surprise;
            let fear = response.Fear;
            let happy = response.Happy;

            let emotions = [anger, sad, neutral, surprise, fear, happy];
            let emotionNames = [
              "anger",
              "sad",
              "neutral",
              "surprise",
              "fear",
              "happy"
            ];

            let highestEmotionValue = 0;
            let highestEmotion;
            for (let i = 0; i < 6; i++) {
              if (emotions[i] > highestEmotionValue) {
                highestEmotionValue = emotions[i];
                highestEmotion = emotionNames[i];
              }
            }

            console.log(highestEmotion);

            //functions according to emotions

            if (highestEmotion === "happy") {
              ledABC = greenLed;
              type1(ledABC);
            } else if (highestEmotion === "fear") {
              ledABC = yellowLed;
              type1(ledABC);
            } else if (highestEmotion === "sad") {
              ledABC = redLed;
              type1(ledABC);
            } else if (highestEmotion === "surprise") {
              ledABC = yellowLed;
              type2(ledABC);
            } else if (highestEmotion === "angry") {
              ledABC = redLed;
              type2(ledABC);
            }
            var motor = new five.Motor(3);
            motor.start();
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
});
