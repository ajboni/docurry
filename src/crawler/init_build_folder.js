const {
  ensureDirSync,
  removeSync,
  copyFileSync,
  copySync,
  outputFileSync,
} = require("fs-extra");
const { config } = require("../../config");
const path = require("path");
const { glob } = require("glob");
const { basename } = require("path");
const { logOK, logJob, logTitle } = require("../utils/log");

exports.initBuildFolder = function () {
  logTitle("Init Build Folder");
  removeSync(config.BUILD_FOLDER);
  removeSync(".temp");
  ensureDirSync(config.BUILD_FOLDER);

  /* Create necesary folders */
  ensureDirSync(path.join(config.BUILD_FOLDER, "css"));
  ensureDirSync(path.join(config.BUILD_FOLDER, "js"));
  ensureDirSync(path.join(config.BUILD_FOLDER, "favicons"));
  ensureDirSync(path.join(config.BUILD_FOLDER, "css", "flags-css"));
  ensureDirSync(path.join(config.BUILD_FOLDER, "css", "flags"));

  ensureDirSync(".cache");

  /* Copy flags css */
  copySync(
    path.join("node_modules", "flag-icon-css", "css", "flag-icon.min.css"),
    path.join(config.BUILD_FOLDER, "css", "flags-css", "flag-icon.min.css")
  );
  copySync(
    path.join("node_modules", "flag-icon-css", "flags"),
    path.join(config.BUILD_FOLDER, "css", "flags")
  );

  /* Copy fuse.js for Searches */
  copySync(
    path.join("node_modules", "fuse.js", "dist", "fuse.min.js"),
    path.join(config.BUILD_FOLDER, "js", "fuse", "fuse.min.js")
  );

  /* Copy templates js */
  exports.copyTemplatesJavascript();
};

exports.copyTemplatesJavascript = function () {
  const srcFolder = path.join("src", "client");
  const jsDstFolder = path.join(config.BUILD_FOLDER, "js");
  const jsGlob = `${srcFolder}/**/*.js`;
  const files = glob.sync(jsGlob);
  files.forEach((file) => {
    copySync(file, path.join(jsDstFolder, basename(file)));
  });
  logOK(`${files.length} client javascript copied.`);
};
