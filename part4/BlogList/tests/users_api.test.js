const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("../utils/users_helper");
const { log } = require("node:console");

const api = supertest(app);

describe("creation of a new user", () => {
	beforeEach(async () => {
		await User.deleteMany({});
		await helper.insertUsers();
	});

	test("succeeds with valid user data", async () => {
		const user = {
			username: "naod19",
			name: "naod",
			password: await bcrypt.hash("1218na", 10),
		};

		const response = await api.post("/api/users").send(user).expect(201);

		const usersAtEnd = await helper.usersInDB();

		assert.strictEqual(usersAtEnd.length, helper.intialUsers.length + 1);
		assert(response.body.username.includes("naod19"));
	});

	describe("fails if", () => {
		test("username is missing", async () => {
			const user = {
				name: "naod",
				password: await bcrypt.hash("1218na", 10),
			};

			const response = await api
				.post("/api/users")
				.send(user)
				.expect(400);

			const usersAtEnd = await helper.usersInDB();

			assert.strictEqual(usersAtEnd.length, helper.intialUsers.length);
			assert(
				response.error.text.includes(
					"username and password are required",
				),
			);
		});

		test("password is missing", async () => {
			const user = {
				username: "naod19",
				name: "naod",
			};

			const response = await api
				.post("/api/users")
				.send(user)
				.expect(400);

			const usersAtEnd = await helper.usersInDB();

			assert.strictEqual(usersAtEnd.length, helper.intialUsers.length);
			assert(
				response.error.text.includes(
					"username and password are required",
				),
			);
		});

		test("username already exists", async () => {
			const user = {
				username: "naod",
				name: "Naod",
				password: "12345",
			};

			const response = await api
				.post("/api/users")
				.send(user)
				.expect(400);

			const usersAtEnd = await helper.usersInDB();

			assert.strictEqual(usersAtEnd.length, helper.intialUsers.length);
			assert(response.error.text.includes("username already exists"));
		});

		test("username is less than 3 characters", async () => {
			const user = {
				username: "na",
				name: "naod",
				password: await bcrypt.hash("1218na", 10),
			};

			const response = await api
				.post("/api/users")
				.send(user)
				.expect(400);

			const usersAtEnd = await helper.usersInDB();

			assert.strictEqual(usersAtEnd.length, helper.intialUsers.length);
			assert(
				response.error.text.includes(
					"username must atleast be 3 characters long",
				),
			);
		});

		test("password is less than 3 characters", async () => {
			const user = {
				username: "naod19",
				name: "naod",
				password: "12",
			};

			const response = await api
				.post("/api/users")
				.send(user)
				.expect(400);

			const usersAtEnd = await helper.usersInDB();

			assert.strictEqual(usersAtEnd.length, helper.intialUsers.length);
			assert(
				response.error.text.includes(
					"passowrd must atleast be 3 characters long",
				),
			);
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
