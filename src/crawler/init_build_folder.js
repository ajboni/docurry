const { ensureDirSync, rmdirSync, mkdirSync } = require("fs-extra");
const { config } = require("../../config");
const path = require("path");

exports.initBuildFolder = function () {
  rmdirSync(config.BUILD_FOLDER, { recursive: true });
  mkdirSync(config.BUILD_FOLDER);

  /* Create necesary folders */
  ensureDirSync(path.join(config.BUILD_FOLDER, "css"));
  ensureDirSync(path.join(config.BUILD_FOLDER, "js"));
  ensureDirSync(path.join(config.BUILD_FOLDER, "favicons"));
  ensureDirSync(".cache");
};
