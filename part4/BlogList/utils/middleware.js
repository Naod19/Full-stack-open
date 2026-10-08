const unknownEndpoint = (req, res) => {
	return res.status(404).json({ message: "unknown endpoint" });
};

module.exports = { unknownEndpoint };
