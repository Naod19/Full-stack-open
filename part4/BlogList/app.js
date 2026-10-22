const express = require("express");
const mongoose = require("mongoose");
const configs = require("./utils/configs");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();
app.use(express.json());

logger.info("connecting to mongodb");
mongoose
	.connect(configs.MONGODB_URI, { family: 4 })
	.then(() => {
		logger.info("connected to mongodb");
	})
	.catch((error) => {
		logger.error("error connecting to mongodb", error);
	});

app.use(middleware.tokenExtractor);

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
