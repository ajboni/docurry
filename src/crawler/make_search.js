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
const { readFileSync, outputFileSync } = require("fs-extra");
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
