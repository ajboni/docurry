const fs = require("fs");
const { config } = require("../../config");
const path = require("path");
const Mustache = require("mustache");
const { logTitle, logOK, logError, logBg } = require("../utils/log");
const { ensureDirSync, ensureFileSync } = require("fs-extra");
const { JSDOM } = require("jsdom");

const { processDocument } = require("./process_document");
const { glob } = require("glob");
const { changeFileExtension } = require("../utils/string_utils");
const { parseExtraFiles } = require("./parse_extra_files");

async function makeDocPages() {
  logTitle("Generate Doc Pages");
  const extraFiles = parseExtraFiles();

  /* Process Markdown and write output */
  const langs = config.LANGUAGES;

  langs.forEach((lang, index) => {
    ensureDirSync(path.join(config.BUILD_FOLDER, lang.id, "docs"));
    const docsFolder = path.join(config.CONTENT_FOLDER, lang.id, "docs");
    const docsGlob = `${docsFolder}/**/*.md`;
    const ignoreGlob = [
      "**/_*", // Exclude files starting with '_'.
      "**/_*/**", // Exclude entire directories starting with '_'.
    ];

    const files = glob.sync(docsGlob, { ignore: ignoreGlob });

    files.forEach((file) => {
      /* Create Target Path */

      let targetPath = path
        .normalize(file)
        .replace(
          path.normalize(config.CONTENT_FOLDER),
          path.normalize(config.BUILD_FOLDER)
        );
      targetPath = changeFileExtension(targetPath, "html");
      ensureFileSync(targetPath);

      /* TODO: STRIP ordering prefix */

      let template = fs.readFileSync(path.join(".temp", "docs.html"), {
        encoding: "utf-8",
      });

      /* Process Document */
      const document = processDocument(file, lang, extraFiles);

      /* Replace variables in template */

      const variables = { ...config, ...document.data };
      template = Mustache.render(template, variables);

      let dom = new JSDOM(template);
      const el = dom.window.document.getElementById("content");
      el.innerHTML = document.html;

      /* Set up metadata */
      dom.window.document.title = document.data.title;
      dom.window.document
        .querySelector('meta[name="description"]')
        .setAttribute("content", document.data.description);
      const processedHTML = dom.serialize();

      // 	/* Finally write the file */
      fs.writeFileSync(targetPath, processedHTML, { encoding: "utf-8" });
    });

    //   fs.writeFileSync("./build/en/docs/index.html", template);
  });
}
module.exports.makeDocPages = makeDocPages;
