import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import expressValidation from "express-validation";
import httpStatus from "http-status";
import helmet from "helmet";
import config from "../config";
import routes from "../src/routes/index.route";
import APIError from "../src/helpers/APIError";

const app = express();

if (config.env === "development" || config.env === "test") {
  app.use(logger("dev"));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount all routes on /api path
app.use("/api", routes);

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map(error => error.messages.join(". "))
      .join(" and ");
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError("API not found", httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack:
      config.env === "development" || config.env === "test" ? err.stack : {}
  })
);

const debug = require("debug")("servantship-backend:index");
// module.parent check is required to support mocha watch
// module.parent is server.js
if (!module.parent.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(
      `${config.appName} started on port ${config.port} (${config.env})`
    );
  });
}

export default app;
