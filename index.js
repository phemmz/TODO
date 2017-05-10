var api, fs, kickoff, kickoffTries, request, url, v0;

global.configs = require('./configs');

global.mongoose = require('mongoose');

api = require('simple-api');

fs = require('fs');

url = require('url');

request = require('request');

v0 = null;

kickoffTries = 0;

kickoff = function() {
  kickoffTries++;
  return mongoose.connect(configs.mongoURL, function(err) {
    if (!err) {
      v0 = new api({
        prefix: ["api", "v0"],
        host: configs.host,
        port: configs.port,
        logLevel: 0
      });
      v0.Controller("tasks", require(__dirname + "/api/v0/controllers/tasks.coffee"));
      require(__dirname + "/api/v0/models/tasks.coffee");
      return console.log(configs.name + " now running at " + configs.host + ":" + configs.port);
    } else if (err & kickoffTries < 5) {
      console.log("Mongoose didn't work.  That's a bummer.  Let's try it again in half a second");
      return setTimeout(kickoff, 500);
    } else if (err) {
      return console.log("Mongo server seems to really be down.  We tried 5 times.  Tough luck.");
    }
  });
};

kickoff();

// ---
// generated by coffee-script 1.9.2