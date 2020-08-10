const path = require("path");
const fse = require("fs-extra");
const { logOK, logTitle, logStatus } = require("../utils/log.js");
const { config } = require("../../config");
const columnify = require("columnify");

/**
 * Copies media content into build folder
 */
exports.copyMedia = () => {
  logTitle("Copy media resources.");
  const { BUILD_FOLDER, CONTENT_FOLDER } = config;
  const srcPath = path.join(CONTENT_FOLDER, "media");
  const dstPath = path.join(BUILD_FOLDER, "media");
  let filesCopied = [];
  const filterFunction = (src, dst) => {
    if (fse.lstatSync(src).isFile()) {
      const file = {
        source: src,
        destination: dst,
      };
      filesCopied.push(file);
    }
    return true;
  };

  //   console.log(columnify(new Array(filesCopied)));
  fse.copySync(srcPath, dstPath, { recursive: true, filter: filterFunction });
  logStatus(columnify(filesCopied));

  logOK(`\n[OK] ${filesCopied.length} files copied`);
};
