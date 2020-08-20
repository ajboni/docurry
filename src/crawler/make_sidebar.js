const { logTitle } = require("../utils/log");
const { config } = require("../../config");

exports.makeSidebars = function () {
  logTitle("Generate Sidebars");

  /* Process Markdown and write output */
  const langs = config.LANGUAGES;

  langs.forEach((lang, index) => {});
};
