const { config } = require("../../config");
var minimatch = require("minimatch");
const { readFileSync } = require("fs-extra");
const matter = require("gray-matter");
const path = require("path");
var md = require("markdown-it")({
  html: true,
  //   linkify: true,
  //   typography: true,
}).use(require("markdown-it-imsize"), { autofill: true });

/**
 * Scans for extra files (eg: readme.md and returns them as an object.)
 * Useful to carry data to the documents.
 * Extra files are defined in config
 * @returns an object with all special files and its contents
 */
exports.parseExtraFiles = function () {
  let obj = {};
  let specialFiles = config.EXTRA_FILES_AS_VARIABLES;
  const files = minimatch.match(specialFiles, "*", { nocase: true });
  files.forEach((file) => {
    let contents = readFileSync(file, { encoding: "utf-8" });

    obj[file.toString().replace(".", "_")] = contents;
  });
  return obj;
};
