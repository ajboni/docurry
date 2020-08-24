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
