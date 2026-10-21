const app = require("./app");
const logger = require("./utils/logger");
const config = require("./utils/config");

const start = async () => {
	try {
		app.listen(config.PORT, () => {
			logger.info(
				`Server is running on port http://localhost:${config.PORT}`,
			);
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

start();
