const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
console.log("Connecting to MongoDB");
mongoose
  .connect(url, { family: 4, dbName: "phonebookDB" })
  .then((result) => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB", error));

const personSchema = new mongoose.Schema({
  name: String,
  phoneNum: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
