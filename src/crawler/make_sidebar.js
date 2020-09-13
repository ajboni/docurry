/**
 * Copyright (C) 2020 Alexis Boni
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
    const jsonPath = path.join(".temp", lang.id, "sidebar.json");
    const sidebarTemplate = path.join("src", "client", "sidebar.html");
    const sidebarPartial = path.join("src", "client", "sidebar_item.html");
    const docListPath = path.join(".temp", lang.id, "doc_list.json");

    const sidebar = JSON.parse(readFileSync(jsonPath, { encoding: "utf-8" }));
    const docList = JSON.parse(
      readFileSync(docListPath, { encoding: "utf-8" })
    );

    const pages = glob.sync(`${docsFolder}/**/*.html`);

    /* Read each file and inject parsed sidebar template*/
    pages.forEach((page, index) => {
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

      /* Set Up Next - Previous buttons */

      const nextPrevButtons = getNextPrevButtons(docList, relPath);
      const nextPrevElement = dom.window.document.getElementById(
        "next-prev-container"
      );
      nextPrevElement.appendChild(nextPrevButtons.prev);
      nextPrevElement.appendChild(nextPrevButtons.next);

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
    if (element.url === docPath) {
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

function getNextPrevButtons(docList, page) {
  if (!config.ADD_NEXT_PREVIOUS_BUTTONS) return;
  let previous = null;
  let next = null;

  for (let index = 0; index < docList.length; index++) {
    const element = docList[index];
    if (element.url === page) {
      if (index > 0) previous = docList[index - 1];
      if (index < docList.length - 1) next = docList[index + 1];
      break;
    }
  }

  const dom = new JSDOM();
  const prevEl = dom.window.document.createElement("div");
  prevEl.className = "prevBtn";
  const nextEl = dom.window.document.createElement("div");
  nextEl.className = "nextBtn";

  if (previous)
    prevEl.innerHTML = `<a class='btn-link btn-action' href='${previous.url}' aria-label='Previous document'> <i class='icon icon-back'> </i> Previous: ${previous.caption}</a>`;

  if (next)
    nextEl.innerHTML = `<a class='btn-link btn-action' href='${next.url}' aria-label='Previous document'>Next: ${next.caption} <i class='icon icon-forward'/></a>`;

  const result = {
    prev: prevEl,
    next: nextEl,
  };

  return result;
}
