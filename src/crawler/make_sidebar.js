const { JSDOM } = require("jsdom");
const { logTitle, logOK } = require("../utils/log");
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
      const el = dom.window.document.getElementById("sidebar-container");

      /* Get relative path and mark JSON item as expanded */
      const relPath = page.replace(path.normalize(config.BUILD_FOLDER), "");
      const expandedSidebar = expandSidebarTo(
        JSON.parse(JSON.stringify(sidebar)),
        relPath
      );

      /* Build u[ mustache view */
      const view = {
        ...config,
        SIDEBAR: expandedSidebar,
        ROOT: `/${lang.id}/docs`,
      };

      const parsedSidebar = Mustache.render(template, view, {
        item: partial,
      });
      el.innerHTML = parsedSidebar;

      writeFileSync(page, dom.serialize());
    });
    logOK(`Generated ${pages.length} sidebar entries for ${lang.caption}`);
  });
};

/**
 * Traverse all objects until reaching the path setting an expanded property on the object.
 *  This is used to automatically expand the sidebar according to the current shown page.
 * @param {Array} sidebar The sidebar array
 * @param {string} docPath The document path.
 * @returns A new object with the properties set.
 */
function expandSidebarTo(sidebar, docPath) {
  const itemObj = getSidebarObjectDeep(sidebar, docPath);
  if (itemObj && itemObj.parent) {
    checkParent(sidebar, itemObj.parent);
    itemObj.isSelected = true;
  }
  return sidebar;
}

function getSidebarObjectDeep(sidebar, docPath) {
  for (let index = 0; index < sidebar.length; index++) {
    const element = sidebar[index];
    if (element.path === docPath) {
      return element;
    } else {
      if (element.children && element.children.length > 0) {
        const match = getSidebarObjectDeep(element.children, docPath);
        if (match) return match;
      }
    }
  }
}

function checkParent(sidebar, docPath) {
  const parentObj = getSidebarObjectDeep(sidebar, docPath);
  if (!parentObj) return null;

  parentObj.checked = "checked";
  if (parentObj.parent) checkParent(sidebar, parentObj.parent);
}
