const fs = require("fs");
const { config } = require("../../config");
const path = require("path");
const Mustache = require("mustache");
const { join } = require("path");
const { logTitle, logOK, logError, logBg } = require("../utils/log");
const { getRandomInt } = require("../utils/math_utils");
const trianglify = require("trianglify");
const { ensureDirSync, pathExistsSync, ensureFileSync } = require("fs-extra");
const { JSDOM } = require("jsdom");

const { processDocument } = require("./process_document");
const { glob } = require("glob");
const {
  getFilenameFromPath,
  removeFileExtension,
  changeFileExtension,
} = require("../utils/string_utils");

async function makeDocPages() {
  logTitle("Generate Doc Pages");

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

      /* TODO: What if content folder is nested?*/

      //   let targetPath = file.split(path.sep);
      //   targetPath[0] = config.BUILD_FOLDER;
      //   targetPath[targetPath.length - 1] = changeFileExtension(
      //     targetPath[targetPath.length - 1],
      //     "html"
      //   );

      //   targetPath = targetPath.join(path.sep);

      const document = processDocument(file, lang);

      /* TODO: STRIP ordering prefix */
      /* TODO: Add to sidebar object */

      let template = fs.readFileSync(path.join(".temp", "docs.html"), {
        encoding: "utf-8",
      });

      /* Replace variables in template */
      template = Mustache.render(template, config);
      fs.writeFileSync(targetPath, template);

      // 	let dom = new JSDOM(template);
      // 	const el = dom.window.document.getElementById("cover-content");
      // 	el.innerHTML = document.html;
      // 	/* Set up metadata */
      // 	dom.window.document.title = document.data.title;
      // 	dom.window.document
      // 	  .querySelector('meta[name="description"]')
      // 	  .setAttribute("content", document.data.description);
      // 	const processedHTML = dom.serialize();
      // 	/* Finally write the file */
      // 	fs.writeFileSync(dstPath, processedHTML, { encoding: "utf-8" });
      // 	/* Default language get special treatment */
      // 	if (index === 0) {
      // 	  /* TODO: Process links and make it relative to the lang folder. */
      // 	  fs.writeFileSync(
      // 		path.join(config.BUILD_FOLDER, "index.html"),
      // 		processedHTML,
      // 		{ encoding: "utf-8" }
      // 	  );
      // 	}
      //   });
      //   /* Concatenate with generated template */
      //   let template = fs.readFileSync(path.join(".temp", "docs.html"), {
      //     encoding: "utf-8",
    });

    //   fs.writeFileSync("./build/en/docs/index.html", template);
  });
}

module.exports.makeDocPages = makeDocPages;
