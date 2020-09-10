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
var pjson = require("../../package.json");

async function makeDocPages() {
  logTitle("Generate Doc Pages");
  const extraFiles = parseExtraFiles();

  const langs = config.LANGUAGES;

  langs.forEach((lang, index) => {
    /* Load NavBar JSON*/
    const navbarJsonPath = path.join(
      config.CONTENT_FOLDER,
      lang.id,
      "navbar.json"
    );

    const navBarButtons = fs.readJSONSync(navbarJsonPath, {
      encoding: "utf-8",
      throws: false,
    });

    /* Generate Sidebar and search database*/
    let sidebar = [];
    let searchDatabase = [];

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
    files.sort();

    files.forEach((file) => {
      const type = fs.statSync(file).isFile()
        ? "File"
        : fs.statSync(file).isDirectory
        ? "Folder"
        : "Unknown";

      /* Create Target Path */
      let targetPath = path
        .normalize(file)
        .replace(
          path.normalize(config.CONTENT_FOLDER),
          path.normalize(config.BUILD_FOLDER)
        );
      targetPath = fs.statSync(file).isFile()
        ? changeFileExtension(targetPath, "html")
        : targetPath;
      targetPath = removeSortingPrefix(targetPath);

      /* We will only continue with markdown files */
      if (type !== "File") {
        /* Add  Folder to sidebar */
        addFolderToSidebar(targetPath, sidebar, lang);
        return;
      }

      /* PROCESS DOCUMENT */

      ensureFileSync(targetPath);

      /* Load html template */
      let template = fs.readFileSync(path.join(".temp", "docs.html"), {
        encoding: "utf-8",
      });

      /* Process Document */
      const document = processDocument(file, lang, extraFiles, targetPath);

      /* Replace variables in template */

      const variables = { ...config, ...document.data, VERSION: pjson.version };
      template = Mustache.render(template, variables);

      let dom = new JSDOM(template);
      const el = dom.window.document.getElementById("docs-content-container");

      el.insertAdjacentHTML("afterbegin", document.html);

      /* Load and process Navbar template */
      let navBarTemplate = fs.readFileSync(
        path.join("src", "client", "navbar.html"),
        {
          encoding: "utf-8",
        }
      );

      navbarVariables = { ...variables, buttons: navBarButtons };
      navBarTemplate = Mustache.render(navBarTemplate, navbarVariables);
      const navbarElement = dom.window.document.getElementById(
        "navbar-container"
      );
      navbarElement.innerHTML = navBarTemplate;

      /* Load and process Footer template */
      let footerTemplate = fs.readFileSync(
        path.join("src", "client", "footer.html"),
        {
          encoding: "utf-8",
        }
      );

      footerVariables = { ...variables };
      footerTemplate = Mustache.render(footerTemplate, footerVariables);
      const footerElement = dom.window.document.getElementById(
        "footer-container"
      );
      footerElement.innerHTML = footerTemplate;

      /* Load and process TOC template */
      let tocTemplate = fs.readFileSync(
        path.join("src", "client", "table_of_contents.html"),
        {
          encoding: "utf-8",
        }
      );

      tocVariables = { ...variables };
      tocTemplate = Mustache.render(tocTemplate, tocVariables);
      const tocElement = dom.window.document.getElementById("toc-container");
      tocElement.outerHTML = tocTemplate;

      /* Set up metadata */
      dom.window.document.title = document.data.title;
      dom.window.document
        .querySelector('meta[name="description"]')
        .setAttribute("content", document.data.description);
      const processedHTML = dom.serialize();

      /* Add Doc to sidebar */
      addDocumentToSidebar(document, sidebar);

      if (config.ENABLE_SEARCH) {
        /* Add Doc to Search Database */
        addDocumentToSearchDatabase(document, searchDatabase);
      }

      /* Finally write the file */
      fs.writeFileSync(targetPath, processedHTML, { encoding: "utf-8" });
    });

    /* Write sidebar to target folder */
    fs.outputFileSync(
      path.join(".temp", lang.id, "sidebar.json"),
      JSON.stringify(sidebar),
      { encoding: "utf-8" }
    );

    /* Write search database to temp folder */
    if (config.ENABLE_SEARCH) {
      fs.outputFileSync(
        path.join(".temp", lang.id, "searchDB.json"),
        JSON.stringify(searchDatabase),
        { encoding: "utf-8" }
      );
    }

    //   fs.writeFileSync("./build/en/docs/index.html", template);
    logOK(`Generated ${files.length} doc pages for ${lang.caption}`);
  });
}
module.exports.makeDocPages = makeDocPages;

function addFolderToSidebar(targetPath, sidebar, lang) {
  if (!config.AUTO_GENERATE_SIDEBAR) return;

  let url = config.REMOVE_EXTENSION_FROM_LINKS
    ? changeFileExtension(path.relative(config.BUILD_FOLDER, targetPath), "")
    : path.relative(config.BUILD_FOLDER, targetPath);

  const name = basename(url, path.extname(url));
  const caption = replaceAll(titleCase(name), /[-_]/, " ");

  /* Make pseudo absolute */
  url = "/" + url;
  let parent = path.dirname(url);

  const obj = {
    name,
    caption,
    url: url,
    type: "Folder",
    parent,
    children: [],
    isFolder: true,
    checked: "", // This is needed because mustache will use parent context if the key is not found.
    isSelected: false, // Same as above.
  };

  const parentObj = findParentDeep(sidebar, parent);

  if (parentObj) {
    parentObj.children.push(obj);
  } else {
    if (
      /* Index will be ommited in sidebar and accessed by the icon */
      targetPath !==
      path.join(config.BUILD_FOLDER, lang.id, "docs", "index.html")
    ) {
      sidebar.push(obj);
    }
  }
}

function addDocumentToSidebar(document, sidebar) {
  if (!config.AUTO_GENERATE_SIDEBAR) return;

  /* Make pseudo absolute */
  let parent = path.dirname(document.url);

  const obj = {
    name: document.name,
    caption: document.caption,
    url: document.url,
    type: "File",
    parent,
    children: [],
    isFolder: false,
    checked: "", // This is needed because mustache will use parent context if the key is not found.
    isSelected: false, // Same as above.
    target: document.target, // ^
  };

  const parentObj = findParentDeep(sidebar, parent);

  if (parentObj) {
    parentObj.children.push(obj);
  } else {
    if (
      /* Index will be ommited in sidebar and accessed by the icon */
      document.buildPath !==
      path.join(config.BUILD_FOLDER, document.lang.id, "docs", "index.html")
    ) {
      sidebar.push(obj);
    }
  }
}

function findParentDeep(data, key) {
  for (let index = 0; index < data.length; index++) {
    const element = data[index];

    if (element.url === key) {
      return element;
    } else {
      const match = findParentDeep(element.children, key);
      if (match) {
        return match;
      }
    }
  }
}

function addDocumentToSearchDatabase(document, db) {
  /* Pick wanted properties: https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties */
  const obj = (({ url, title, plainTextContent }) => ({
    url,
    title,
    plainTextContent,
  }))(document);
  db.push(obj);
}
