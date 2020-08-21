const fs = require("fs-extra");
const { config } = require("../../config");
const path = require("path");
const Mustache = require("mustache");
const { logTitle, logOK, logError, logBg } = require("../utils/log");
const {
  ensureDirSync,
  ensureFileSync,
  existsSync,
  readFileSync,
} = require("fs-extra");
const { JSDOM } = require("jsdom");

const { processDocument } = require("./process_document");
const { glob } = require("glob");
const {
  changeFileExtension,
  removeSortingPrefix,
  isValidJSON,
} = require("../utils/string_utils");
const { parseExtraFiles } = require("./parse_extra_files");
const { basename, dirname } = require("path");
const { titleCase, replaceAll } = require("voca");

async function makeDocPages() {
  logTitle("Generate Doc Pages");
  const extraFiles = parseExtraFiles();

  /* Process Markdown and write output */
  const langs = config.LANGUAGES;

  langs.forEach((lang, index) => {
    /* Generate Sidebar */
    let sidebar = [];
    const sidebarTemplatePath = path.join(
      config.CONTENT_FOLDER,
      lang.id,
      "sidebar.json"
    );
    if (existsSync(sidebarTemplatePath)) {
      const sidebarJSON = readFileSync(sidebarTemplatePath, {
        encoding: "utf-8",
      });
      if (isValidJSON(sidebarJSON)) {
        sidebar = JSON.parse(sidebarJSON);
      }
    }

    ensureDirSync(path.join(config.BUILD_FOLDER, lang.id, "docs"));
    const docsFolder = path.join(config.CONTENT_FOLDER, lang.id, "docs");

    /*   Allow only markdown and folders */
    const docsGlob = `${docsFolder}/**/*{/,.md}`;
    const ignoreGlob = [
      "**/_*", // Exclude files starting with '_'.
      "**/_*/**", // Exclude entire directories starting with '_'.
    ];

    const files = glob.sync(docsGlob, { ignore: ignoreGlob, nosort: true });

    files.forEach((file) => {
      /* Create Target Path */
      let targetPath = path
        .normalize(file)
        .replace(
          path.normalize(config.CONTENT_FOLDER),
          path.normalize(config.BUILD_FOLDER)
        );
      targetPath = changeFileExtension(targetPath, "html");
      targetPath = removeSortingPrefix(targetPath);

      const type = fs.statSync(file).isFile()
        ? "File"
        : fs.statSync(file).isDirectory
        ? "Directory"
        : "Unknown";

      /* Add to sidebar */
      addPathToSidebar(targetPath, sidebar, type);

      /* We will only continue with markdown files */
      if (type !== "File") return;

      ensureFileSync(targetPath);

      /* Load html template */
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
    console.log(sidebar);

    //   fs.writeFileSync("./build/en/docs/index.html", template);
  });
}
module.exports.makeDocPages = makeDocPages;

function addPathToSidebar(targetPath, sidebar, type) {
  if (!config.AUTO_GENERATE_SIDEBAR) return;

  let _path = config.REMOVE_EXTENSION_FROM_LINKS
    ? changeFileExtension(path.relative(config.BUILD_FOLDER, targetPath), "")
    : path.relative(config.BUILD_FOLDER, targetPath);

  const name = basename(_path);
  const caption = replaceAll(titleCase(name), /[-_]/, " ");
  let parent = basename(dirname(_path));

  const obj = {
    name,
    caption,
    path: _path,
    type,
    parent,
    children: [],
  };

  const parentObj = sidebar.find((x) => x.name === parent);
  if (parentObj) {
    parentObj.children.push(obj);
  } else {
    sidebar.push(obj);
  }
}
