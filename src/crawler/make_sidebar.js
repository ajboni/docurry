const { JSDOM } = require("jsdom");
const { logTitle } = require("../utils/log");
const { readFileSync, writeFileSync, read } = require("fs");
const { config } = require("../../config");
const { glob } = require("glob");
const path = require("path");
const Mustache = require("mustache");

exports.makeSidebars = function () {
  logTitle("Generate Sidebars");

  const langs = config.LANGUAGES;

  langs.forEach((lang, index) => {
    const docsFolder = path.join(config.BUILD_FOLDER, lang.id, "docs");
    const jsonPath = path.join(config.BUILD_FOLDER, lang.id, "sidebar.json");
    const sidebarTemplate = path.join("src", "client", "sidebar.html");
    const sidebarPartial = path.join("src", "client", "sidebar_item.html");

    const sidebar = JSON.parse(readFileSync(jsonPath, { encoding: "utf-8" }));

    const pages = glob.sync(`${docsFolder}/**/*.html`);

    /* Read each file and inject parsed sidebar template*/
    pages.forEach((page) => {
      const template = readFileSync(sidebarTemplate, { encoding: "utf-8" });
      const partial = readFileSync(sidebarPartial, { encoding: "utf-8" });
      const content = readFileSync(page, { encoding: "utf-8" });

      let dom = new JSDOM(content);
      const el = dom.window.document.getElementById("sidebar");

      /* Build u[ mustache view */
      const view = { ...config, SIDEBAR: sidebar, ROOT: `/${lang.id}/docs` };

      const parsedSidebar = Mustache.render(template, view, {
        item: partial,
      });
      el.innerHTML = parsedSidebar;

      writeFileSync(page, dom.serialize());
    });

    // console.log(tree);
    // const files = glob.sync(docsGlob, { ignore: ignoreGlob });
    // files.forEach((file) => {
    //   console.log(path.relative(docsFolder, path.dirname(file)));
    // });
  });
};
