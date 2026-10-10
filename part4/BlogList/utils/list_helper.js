const _ = require("lodash");

const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((sum, item) => {
		return sum + item.likes;
	}, 0);
};

const favoriteBlog = (blogs) => {
	return blogs.length === 0
		? 0
		: blogs.reduce((favorite, currentItem) => {
				return currentItem.likes > favorite.likes
					? currentItem
					: favorite;
			});
};

const mostBlogs = (blogs) => {
	if (blogs.length === 0) return 0;

	const blogCount = _.countBy(blogs, "author");
	const author = _.maxBy(Object.keys(blogCount), (name) => blogCount[name]);

	return { author, blogs: blogCount[author] };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
