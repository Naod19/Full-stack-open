const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("../utils/blog_helper");

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(helper.intialBlogs);
});

test("the correct number of blogs is returned and are in json", async () => {
	const response = await api
		.get("/api/blogs")
		.expect(200)
		.expect("Content-type", /application\/json/);

	assert.strictEqual(response.body.length, helper.intialBlogs.length);
});

test("the identifier property of the blog post is named 'id'", async () => {
	const blogs = await api.get("/api/blogs");
	blogs.body.forEach((blog) => {
		assert(Object.keys(blog).includes("id"));
		assert(!Object.keys(blog).includes("_id"));
	});
});

test("a valid blog can be created", async () => {
	const newBlog = {
		title: "Hello world",
		author: "Naod",
		url: "www.helpabrother.com",
		likes: 20,
	};

	const response = await api
		.post("/api/blogs")
		.send(newBlog)
		.expect(201)
		.expect("Content-type", /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();

	assert.strictEqual(blogsAtEnd.length, helper.intialBlogs.length + 1);
	const savedBlog = blogsAtEnd.find((blog) => blog.id === response.body.id);
	const { id, user, ...restOfBlog } = savedBlog;
	assert.deepStrictEqual(restOfBlog, newBlog);
});

test("if like property is missing it defaults to 0", async () => {
	const newBlog = {
		title: "Hello world",
		author: "Naod",
		url: "www.helpabrother.com",
	};

	const response = await api
		.post("/api/blogs")
		.send(newBlog)
		.expect(201)
		.expect("Content-type", /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	const savedBlog = blogsAtEnd.find((blog) => blog.id === response.body.id);

	assert.strictEqual(savedBlog.likes, 0);
});

describe("server should respond with a status of 400 when creating a new blog", () => {
	test("if title property of the blog is missing", async () => {
		const newBlog = {
			author: "Naod",
			url: "www.helpabrother.com",
			likes: 10,
		};

		await api.post("/api/blogs").send(newBlog).expect(400);
	});
	test("if url property of the blog is missing", async () => {
		const newBlog = {
			title: "Hello world",
			author: "Naod",
			likes: 10,
		};

		await api.post("/api/blogs").send(newBlog).expect(400);
	});
});

describe("blog likes can be updated", () => {
	test("if valid id is given", async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];

		const response = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send({ likes: 230 })
			.expect(200);

		const blogsAtEnd = await helper.blogsInDb();

		const updatedBlog = blogsAtEnd.find(
			(blog) => blog.id === response.body.id,
		);

		assert.strictEqual(updatedBlog.likes, 230);
	});

	test("if non-existent id is given, server responds with a status code 404", async () => {
		const id = "6ac762687478734454e320c2";

		await api.put(`/api/blogs/${id}`).send({ likes: 230 }).expect(404);
	});
});

test("blog is deleted if the correct id is given", async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToDelete = blogsAtStart[0];

	await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

	const blogsAtEnd = await helper.blogsInDb();
	const ids = blogsAtEnd.map((blog) => blog.id);

	assert.strictEqual(blogsAtEnd.length, helper.intialBlogs.length - 1);
	assert(!ids.includes(blogToDelete.id));
});

after(async () => {
	await mongoose.connection.close();
});
