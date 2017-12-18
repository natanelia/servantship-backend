require("dotenv").config();

const config = {
    env: process.env.NODE_ENV,
    appName: process.env.APP_NAME,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
};

if (config.env === "test") {
  config.postgres = {
    db: process.env.PG_DB_TEST,
    port: process.env.PG_PORT_TEST,
    host: process.env.PG_HOST_TEST,
    user: process.env.PG_USER_TEST,
    passwrd: process.env.PG_PASSWD,
  };
} else {
  config.postgres = {
    db: process.env.PG_DB,
    port: process.env.PG_PORT,
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    passwd: process.env.PG_PASSWD,
  };
}

export default config;
