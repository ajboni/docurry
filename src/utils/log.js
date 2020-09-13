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

const chalk = require("chalk");

exports.logStatus = (msg) => {
  console.log(chalk.gray`${msg}`);
};
exports.logOK = (msg) => {
  console.log(chalk.green`[OK] ${msg}`);
};
exports.logError = (msg) => {
  console.trace(chalk.red`[ERROR] ${msg}`);
};

exports.logBg = (msg) => {
  console.log(chalk.hex("#f29312")`[BACKGROUND] ${msg}`);
};

exports.logJob = (msg) => {
  console.log(chalk.hex("#f29312")`[...] ${msg}`);
};

exports.logWarning = (msg) => {};
exports.logTitle = (msg) => {
  console.log(chalk.bold.whiteBright`\n-------- ${msg} -------- \n`);
};
