const {
  ensureDirSync,
  removeSync,
  copyFileSync,
  copySync,
} = require("fs-extra");
const { config } = require("../../config");
const path = require("path");

exports.initBuildFolder = function () {
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
  copyFileSync(
    path.join("node_modules", "flag-icon-css", "css", "flag-icon.min.css"),
    path.join(config.BUILD_FOLDER, "css", "flags-css", "flag-icon.min.css")
  );

  copySync(
    path.join("node_modules", "flag-icon-css", "flags"),
    path.join(config.BUILD_FOLDER, "css", "flags")
  );
};
