const express = require("express");
const mongoose = require("mongoose");
const configs = require("./utils/configs");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogRouter = require("./controllers/blogs");

const app = express();
app.use(express.json());

logger.info("connecting to mongodb");
mongoose
	.connect(configs.MONGODB_URI, { family: 4, dbName: "blogApp" })
	.then(() => {
		logger.info("connected to mongodb");
	})
	.catch((error) => {
		logger.error("error connecting to mongodb", error);
	});

app.use("/api/blogs", blogRouter);

app.use(middleware.unknownEndpoint);

module.exports = app;
