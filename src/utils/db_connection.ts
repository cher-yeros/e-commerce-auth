import { configDotenv } from "dotenv";
import path from "path";
import { Sequelize } from "sequelize-typescript";

configDotenv();

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),

  dialect: "mysql",
  models: [path.join(__dirname, "../models/**/*.model.ts")],

  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("📂  Connection has been established successfully.\n");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("Models synchronized with the database");
//   })
//   .catch((error) => {
//     console.error("Error synchronizing models:", error);
//   });

export default sequelize;
