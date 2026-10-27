const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const loginRouter = require("express").Router();

loginRouter.post("/", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.status(400).json({ error: "username or password missing" });
	}

	const user = await User.findOne({ username });

	const passwordCheck =
		user && (await bcrypt.compare(password, user.password));

	if (!(user && passwordCheck)) {
		return res.status(401).json({ error: "Invalid username or password" });
	}

	const userForToken = {
		username: user.username,
		id: user._id,
	};

	const token = jwt.sign(userForToken, process.env.TOKEN_SECRET, {
		expiresIn: 60 * 60,
	});

	res.status(200).json({ username: user.username, name: user.name, token });
});

module.exports = loginRouter;
