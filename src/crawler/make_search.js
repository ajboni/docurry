const { config } = require("../../config");
const { readFileSync, outputFileSync } = require("fs-extra");
const lunr = require("lunr");
const path = require("path");

/**
 * Add javascript necesary to perform a seach on this document
 *
 * @param {document} Document to add search to.
 * @returns
 */
exports.makeSearch = function () {
  if (!config.ENABLE_SEARCH) return;

  config.LANGUAGES.forEach((lang) => {
    const docs = JSON.parse(
      readFileSync(path.join(".temp", lang.id, "searchDB.json"), {
        encoding: "utf-8",
      })
    );

    const idx = lunr(function () {
      this.ref("url");
      this.field("plainTextContent");
      this.field("title");
      this.metadataWhitelist = ["plainTextContent", "position"];

      docs.forEach(function (doc) {
        this.add(doc);
      }, this);
    });

    outputFileSync(
      path.join(config.BUILD_FOLDER, lang.id, "searchIndex.json"),
      JSON.stringify(idx)
    );
  });
};
