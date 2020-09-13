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

/**
 * Given to dates, return the diference in seconds between them
 *
 * @param {Date} start
 * @param {Date} end
 * @returns The difference in seconds between start and end dates.
 */
exports.timeElpasedInSeconds = function (start, end) {
  var timeDiff = end - start; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  const seconds = timeDiff;
  return seconds;
};
