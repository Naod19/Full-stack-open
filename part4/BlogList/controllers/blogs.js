const jwt = require("jsonwebtoken");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({}).populate("user", "-blogs");
	res.json(blogs);
});

blogRouter.post("/", async (req, res) => {
	const decodedToken = jwt.verify(req.token, process.env.TOKEN_SECRET);

	if (!decodedToken.id) {
		return res.status(401).json({ error: "Invalid token" });
	}

	const blog = new Blog({ ...req.body, user: decodedToken.id });
	const savedBlog = await blog.save();

	const user = await User.findOne({ username: decodedToken.username });
	user.blogs = [...user.blogs, savedBlog._id];
	await user.save();

	res.status(201).json(savedBlog);
});

blogRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	const { likes } = req.body;

	const blogToUpdate = await Blog.findById(id);

	if (!blogToUpdate) {
		return res.status(404).json({ message: "Blog was not found" });
	}

	blogToUpdate.likes = likes;

	const updatedBlog = await blogToUpdate.save();
	res.json(updatedBlog);
});

blogRouter.delete("/:id", async (req, res) => {
	const decodedToken = jwt.verify(req.token, process.env.TOKEN_SECRET);
	const id = req.params.id;

	const blogToDelete = await Blog.findById(id);
	if (!blogToDelete) {
		return res.status(404).json({ error: "blog not found" });
	}

	if (blogToDelete.user.toString() !== decodedToken.id) {
		return res.status(403).json({ error: "operation forbidden" });
	}

	await blogToDelete.deleteOne();
	res.status(204).end();
});

module.exports = blogRouter;
