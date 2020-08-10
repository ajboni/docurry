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
