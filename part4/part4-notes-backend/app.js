const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

const connectDB = async () => {
	try {
		logger.info("connecting to mongodb");
		const result = await mongoose.connect(config.MONGODB_URI, {
			family: 4,
		});
		if (result) logger.info("connected to mongodb");
	} catch (error) {
		logger.info(`${error.name}:`, error.message);
	}
};
connectDB();

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
