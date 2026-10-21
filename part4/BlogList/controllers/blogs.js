const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({}).populate("user", "-blogs");
	res.json(blogs);
});

blogRouter.post("/", async (req, res) => {
	const randomUser = await User.findOne();
	const blog = new Blog({ ...req.body, user: randomUser._id });

	const savedBlog = await blog.save();

	randomUser.blogs = [...randomUser.blogs, savedBlog._id];
	await randomUser.save();

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
	const id = req.params.id;

	await Blog.findByIdAndDelete(id);
	res.status(204).end();
});

module.exports = blogRouter;
