/**
 * Returns a random int between min and max
 * @param {number} min
 * @param {number} max
 * @returns A Random number between min and max
 */
exports.getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
