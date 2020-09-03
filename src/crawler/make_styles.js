var sass = require("node-sass");
const { config } = require("../../config");
const path = require("path");
const { logError, logOK, logTitle } = require("../utils/log");
const { writeFileSync } = require("fs");
var glob = require("glob");
const { getFilenameFromPath } = require("../utils/string_utils");

exports.makeStyles = function () {
  logTitle("Generating Styles");

  //   const srcPath = path.join("src", "client", "style.scss");
  //   const dstPath = path.join(config.BUILD_FOLDER, "css", "style.css");

  // options is optional
  const files = glob.sync("src/client/**/*.scss");
  try {
    files.forEach((srcPath) => {
      if (getFilenameFromPath(srcPath, false).startsWith("_")) return;
      const dstPath = path.join(
        config.BUILD_FOLDER,
        "css",
        `${getFilenameFromPath(srcPath, false)}.css`
      );
      const result = sass.renderSync({
        file: srcPath,
        outputStyle: "compressed",
      });
      writeFileSync(dstPath, result.css);
      logOK(`Convert sass styles into css: ${srcPath} => ${dstPath}`);
    });
  } catch (error) {
    logError(error);
  }
};
