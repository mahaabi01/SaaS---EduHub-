import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";
config()

const sequelize = new Sequelize({
  database: process.env.DB_NAME, // database name
  username: process.env.DB_USERNAME, // database username
  password: process.env.DB_PASSWORD, // database password
  host: process.env.DB_HOST, // database location - localhost is for locally running computer
  dialect: "mysql", // database type going to be used
  port: Number(process.env.DB_PORT), // port number allocation
  models: [__dirname + "/models"],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Authenticated !");
  })
  .catch((error) => {
    console.log(error);
  });

sequelize.sync({ force: false }).then(() => {
  console.log("DB migrated!");
});

export default sequelize;
