const chalk = require("chalk");

exports.logStatus = (msg) => {
  console.log(chalk.gray`${msg}`);
};
exports.logOK = (msg) => {
  console.log(chalk.green`${msg}`);
};
exports.logError = (msg) => {};
exports.logWarning = (msg) => {};
exports.logTitle = (msg) => {
  console.log(chalk.bold.whiteBright`\n-------- ${msg} -------- \n`);
};
