const { logTitle } = require("../utils/log");
const { config } = require("../../config");
const { glob } = require("glob");
const path = require("path");
const dirTree = require("directory-tree");

exports.makeSidebars = function () {
  logTitle("Generate Sidebars");

  const langs = config.LANGUAGES;
  let sidebar = {};

  langs.forEach((lang, index) => {
    const docsFolder = path.join(config.CONTENT_FOLDER, lang.id, "docs");
    const docsGlob = `${docsFolder}/**/*`;
    const ignoreGlob = /^_+.*/;

    const tree = dirTree(docsFolder, { exclude: ignoreGlob }, (item) => {});
    // console.log(tree);
    // const files = glob.sync(docsGlob, { ignore: ignoreGlob });
    // files.forEach((file) => {
    //   console.log(path.relative(docsFolder, path.dirname(file)));
    // });
  });
};
