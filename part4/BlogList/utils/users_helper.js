const bcrypt = require("bcrypt");
const User = require("../models/user");

const intialUsers = [
	{
		username: "naod",
		name: "Naod",
		password: "12345",
	},
	{
		username: "amara_k",
		name: "Amara Kato",
		password: "00000",
	},
	{
		username: "jdoe",
		name: "John Doe",
		password: "01234",
	},
];

const insertUsers = async () => {
	const usersToInsert = await Promise.all(
		intialUsers.map(async (user) => ({
			...user,
			password: await bcrypt.hash(user.password, 10),
		})),
	);

	await User.insertMany(usersToInsert);
};

const usersInDB = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

module.exports = { intialUsers, usersInDB, insertUsers };
