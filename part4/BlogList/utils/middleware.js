const unknownEndpoint = (req, res) => {
	return res.status(404).json({ message: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
	if (error.name === "ValidationError") {
		return res
			.status(400)
			.json({ message: "title or url should not be missing" });
	}

	next(error);
};

module.exports = { unknownEndpoint, errorHandler };
