const chalk = require('chalk');
const mongoose = require('mongoose');

main().catch(err => console.log(chalk.red.inverse(err)));

async function main() {
  await mongoose.connect(`${process.env.db_URI}`);
  console.log(chalk.green.inverse("Successfully connected to DataBase."))
}
const db=mongoose.connect;
module.exports=db;