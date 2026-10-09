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

module.exports = { dummy, totalLikes, favoriteBlog };
