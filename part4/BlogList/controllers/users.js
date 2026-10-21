const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

// get all users
userRouter.get("/", async (req, res) => {
	const users = await User.find({}).populate("blogs", "-user -likes");
	res.json(users);
});

// Creating a user
userRouter.post("/", async (req, res) => {
	const { username, name, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ error: "username and password are required" });
	}

	if (password.length < 3) {
		return res
			.status(400)
			.json({ error: "passowrd must atleast be 3 characters long" });
	}

	const passwordHash = await bcrypt.hash(password, 10);

	const user = new User({
		username,
		name,
		password: passwordHash,
	});

	const savedUser = await user.save();
	res.status(201).json(savedUser);
});

module.exports = userRouter;
