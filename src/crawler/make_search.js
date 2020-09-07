const { config } = require("../../config");
const { readFileSync, outputFileSync } = require("fs-extra");
var elasticlunr = require("elasticlunr");
const Fuse = require("fuse.js");
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

    const options = {
      keys: [
        { name: "plainTextContent", weight: 1 },
        { name: "title", weight: 12 },
        { name: "url", weight: 0.5 },
      ],
    };
    const index = Fuse.createIndex(options.keys, docs);

    // const index = elasticlunr();
    // index.addField("title");
    // index.addField("plainTextContent");
    // index.setRef("url");
    // index.saveDocument(true);

    // docs.forEach(function (doc) {
    //   index.addDoc(doc);
    // });

    outputFileSync(
      path.join(config.BUILD_FOLDER, lang.id, "searchIndex.json"),
      JSON.stringify(index.toJSON())
    );
    outputFileSync(
      path.join(config.BUILD_FOLDER, lang.id, "searchDatabase.json"),
      JSON.stringify(docs)
    );
  });
};
