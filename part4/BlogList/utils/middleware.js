const unknownEndpoint = (req, res) => {
	return res.status(404).json({ message: "unknown endpoint" });
};

const tokenExtractor = (req, res, next) => {
	const authHeader = req.get("authorization");

	req.token =
		authHeader && authHeader.startsWith("Bearer ")
			? authHeader.split(" ")[1]
			: null;

	next();
};

const errorHandler = (error, req, res, next) => {
	if (
		error.name === "ValidationError" &&
		error.message.includes("is shorter than the minimum allowed length")
	) {
		return res.status(400).json({
			error: "username must atleast be 3 characters long",
		});
	} else if (error.name === "ValidationError") {
		return res
			.status(400)
			.json({ error: "title or url should not be missing" });
	}

	if (error.message.includes("data and salt arguments required")) {
		return res.status(400).json({ error: "password is missing" });
	}

	if (
		error.name === "MongoServerError" &&
		error.message.includes("E11000 duplicate key error")
	) {
		return res.status(400).json({ error: "username already exists" });
	}

	if (error.name === "JsonWebTokenError") {
		return res
			.status(401)
			.json({ error: "Invalid token", err: error.mesager });
	}

	next(error);
};

module.exports = { unknownEndpoint, errorHandler, tokenExtractor };
