const chalk = require("chalk");

exports.logStatus = (msg) => {
  console.log(chalk.gray`${msg}`);
};
exports.logOK = (msg) => {
  console.log(chalk.green`[OK] ${msg}`);
};
exports.logError = (msg) => {
  console.log(chalk.red`[ERROR] ${msg}`);
};
exports.logWarning = (msg) => {};
exports.logTitle = (msg) => {
  console.log(chalk.bold.whiteBright`\n-------- ${msg} -------- \n`);
};
