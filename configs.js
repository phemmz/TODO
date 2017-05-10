var configs, exports, ref;

if (!((ref = process.env) != null ? ref.application_env : void 0)) {
  process.env.application_env = "local";
}

configs = {
  name: "SimpleToDo"
};

switch (process.env.application_env) {
  case "local":
    configs.mongoURL = "mongodb://localhost/simpledb";
    configs.host = "localhost";
    configs.port = "3333";
    configs.url = "http://localhost:3333";
}

module.exports = exports = configs;