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

const { readFileSync } = require("fs-extra");
const path = require("path");
const Mustache = require("mustache");
const matter = require("gray-matter");
const { config } = require("../../config");
const { captionFromPath } = require("../utils/string_utils");
const { JSDOM } = require("jsdom");
const twemoji = require("twemoji");
const v = require("voca");
const hljs = require("highlight.js");
const htmlToText = require("html-to-text");
const { basename } = require("path");
const { replaceAll, titleCase } = require("voca");

var md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  // Actual default values
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code data-lang="${lang}">${
          hljs.highlight(lang, str, true).value
        }</code></pre>`;
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
  //   typography: true,
})
  .use(require("markdown-it-imsize"), { autofill: true })
  .use(require("markdown-it-anchor"), {
    permalink: true,
    // permalinkSymbol:
    //   '<svg aria-hidden="true" height="24" version="1.1" viewBox="0 0 24 24" width="24"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>',
    // permalinkSpace: true,
    permalinkBefore: false,
  })
  //   .use(require("markdown-it-external-links"), {
  //     externalClassName: null,
  //     externalRel: "noopener noreferrer",
  //     externalTarget: "_blank",
  //   })
  .use(require("markdown-it-emoji"), [])
  .use(require("markdown-it-task-lists"), {
    label: true,
  });

md.renderer.rules.emoji = function (token, idx) {
  return twemoji.parse(token[idx].content);
};

/**
 * Given a filepath it will return a document with markdown processed, metadata replaced, and converted to html
 *
 * @param {Filepath} filePath
 * @returns An object with: content, data, html properties.
 */
exports.processDocument = function (
  filePath,
  lang,
  extraFiles = {},
  targetPath
) {
  const fallbackTitle = captionFromPath(filePath);
  const indexContentMD = readFileSync(filePath, { encoding: "utf-8" });

  /* Process Frontmatter */
  document = matter(indexContentMD);

  /* Add base properties */
  document.buildPath = targetPath;

  document.lang = lang;

  document.url = config.REMOVE_EXTENSION_FROM_LINKS
    ? "/" +
      changeFileExtension(
        path.relative(config.BUILD_FOLDER, document.buildPath),
        ""
      )
    : "/" + path.relative(config.BUILD_FOLDER, document.buildPath);

  document.name = basename(
    document.buildPath,
    path.extname(document.buildPath)
  );

  /* Process Extra Files */
  if (extraFiles) {
    document.content = Mustache.render(document.content, extraFiles);
    // To support JS
    const Entities = require("html-entities").XmlEntities;
    const entities = new Entities();

    document.content = entities.decode(document.content);
  }

  /* Render Markdown */
  document.html = md.render(document.content);

  /* Build the variables */
  document.data = {
    ...config,
    ...document.data,
    LANG: lang,
    ROOT: `${lang.id}/docs/`,
    TOC: makeTableOfContents(document),
  };

  if (!document.data.title) document.data.title = fallbackTitle;
  if (!document.data.caption) document.data.caption = fallbackTitle;
  if (document.data.url) document.url = document.data.url;
  if (document.data.external) document.external = document.data.external;

  if (!document.data.description)
    document.data.description = config.PROJECT_DESCRIPTION;

  document.title = document.data.title;
  document.caption = document.data.caption;

  /* On Landing pages we will format the title differently */
  landingPagePath = path.join(config.CONTENT_FOLDER, lang.id, "index.md");
  if (filePath === landingPagePath) {
    document.data.title = `${document.data.title} · ${document.data.description}`;
  } else {
    document.data.title = `${document.data.title} · ${config.PROJECT_NAME}`;
  }
  /* Make relative links relative to current language */
  var dom = new JSDOM(document.html);
  const links = dom.window.document.getElementsByTagName("a");

  for (const link of links) {
    var relative = new RegExp("^(?:[a-z]+:)?///", "i");
    if (!relative.test(link.href)) {
      if (link.href.startsWith("//"))
        link.href = `/${lang.id}/${link
          .toString()
          .substr(2, link.toString().length)}`;
    }
  }

  /* Add language information to <code> tags */
  const blocks = dom.window.document.querySelectorAll("pre.hljs code");
  blocks.forEach((element) => {
    const lang = element.getAttribute("data-lang");
    const langElement = dom.window.document.createElement("label");
    langElement.innerHTML = lang;
    langElement.className = "language-caption";

    element.insertAdjacentElement("beforebegin", langElement);
  });

  document.html = dom.serialize();

  /* Process HTML to replace variables */
  document.html = Mustache.render(document.html, document.data);
  document.plainTextContent = htmlToText.fromString(document.html, {
    format: {
      anchor: function (el, fn, options) {
        return "";
      },
    },
  });

  return document;
};

function makeTableOfContents(document) {
  var dom = new JSDOM(document.html);
  const tags = Array.from(
    dom.window.document.querySelectorAll("a.header-anchor")
  );
  let result = [];
  tags.forEach((tag) => {
    result.push({
      hash: tag.hash,
      content: tag.previousSibling.data,
      tag: tag.parentElement.tagName.toLowerCase(),
    });
  });
  return result;
}
