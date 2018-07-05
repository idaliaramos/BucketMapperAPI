if (process.env.NODE_ENV == 'production') {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`
  });
}
console.log(process.env.NODE_ENV, 'this is the process <<<<<<<<<<<<<<<<');
console.log(process.env.PGHOST, 'this is the host<<<<<<<<<<<<<<<<');
console.log(process.env.JWT_KEY, 'this is the kye <<<<<<<<<<<<<<<<');
console.log(process.env.PGDATABASE, 'this is the database <<<<<<<<<<<<<<<<');
console.log(process.env.PGUSER, 'this is the user<<<<<<<<<<<<<<<<');
module.exports = {
  DEBUG: parseInt(process.env.DEBUG || 0),
  PGHOST: process.env.PGHOST,
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGDATABASE: process.env.PGDATABASE,
  JWT_KEY: process.env.JWT_KEY
};
