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

const { config } = require("../../config");
var minimatch = require("minimatch");
const { readFileSync } = require("fs-extra");
const matter = require("gray-matter");
const path = require("path");
var md = require("markdown-it")({
  html: true,
  linkify: true,
  //   typography: true,
})
  .use(require("markdown-it-imsize"), { autofill: true })
  .use(require("markdown-it-imsize"), { autofill: true })
  .use(require("markdown-it-anchor"), {
    permalink: true,
    permalinkBefore: true,
  })
  .use(require("markdown-it-external-links"), {
    externalClassName: null,
    externalRel: "noopener noreferrer",
    externalTarget: "_blank",
  })
  .use(require("markdown-it-task-lists"), {
    label: true,
  });

/**
 * Scans for extra files (eg: readme.md and returns them as an object.)
 * Useful to carry data to the documents.
 * Extra files are defined in config
 * @returns an object with all special files and its contents
 */
exports.parseExtraFiles = function () {
  let obj = {};
  let specialFiles = config.EXTRA_FILES_AS_VARIABLES;
  const files = minimatch.match(specialFiles, "*", { nocase: true });
  files.forEach((file) => {
    let contents = readFileSync(file, { encoding: "utf-8" });

    obj[file.toString().replace(".", "_")] = contents;
  });
  return obj;
};
