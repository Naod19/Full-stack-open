const app = require("./app");
const configs = require("./utils/configs");

app.listen(configs.PORT, () => {
	console.log(`Server running on port http://localhost:${configs.PORT}`);
});
