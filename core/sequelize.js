import Sequelize from "sequelize";
import config from "../config";

const sequelize = new Sequelize(
  config.postgres.db,
  config.postgres.user,
  config.postgres.password,
  {
    dialect: "postgres",
    port: config.postgres.port,
    host: config.postgres.host,
    define: {
      timestamps: true
    },
    logging: false
  }
);

if (config.env !== "test") {
  sequelize.sync().then(() => {
    console.log("Database Synchronized");
  });
}

export default sequelize;
