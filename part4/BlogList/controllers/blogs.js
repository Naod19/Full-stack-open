const jwt = require("jsonwebtoken");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({}).populate("user", "-blogs");
	res.json(blogs);
});

blogRouter.post("/", userExtractor, async (req, res) => {
	const user = req.user;

	const blog = new Blog({ ...req.body, user: user.id });
	const savedBlog = await blog.save();

	await savedBlog.populate("user", "-blogs");

	user.blogs = [...user.blogs, savedBlog._id];
	await user.save();

	res.status(201).json(savedBlog);
});

blogRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	const { likes } = req.body;

	const blogToUpdate = await Blog.findById(id).populate("user", "-blogs");

	if (!blogToUpdate) {
		return res.status(404).json({ message: "Blog was not found" });
	}

	blogToUpdate.likes = likes;

	const updatedBlog = await blogToUpdate.save();
	res.json(updatedBlog);
});

blogRouter.delete("/:id", userExtractor, async (req, res) => {
	const id = req.params.id;
	const user = req.user;

	const blogToDelete = await Blog.findById(id);
	if (!blogToDelete) {
		return res.status(404).json({ error: "blog not found" });
	}

	if (blogToDelete.user.toString() !== user.id) {
		return res.status(403).json({ error: "operation forbidden" });
	}

	await blogToDelete.deleteOne();

	user.blogs = user.blogs.filter(
		(blog) => blog.toString() !== blogToDelete._id.toString(),
	);
	await user.save();

	res.status(204).end();
});

module.exports = blogRouter;
