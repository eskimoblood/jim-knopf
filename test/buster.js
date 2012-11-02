var config = module.exports;

config["My tests"] = {
  rootPath: "../",
  environment: "browser",
  sources: [
    "dist/knob.js"
  ],
  tests: [
    "test/*-test.js"
  ]
};
