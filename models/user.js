const mongoose = require("mongoose");

require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: String,
  email: String,
  password: {
    type: String,
    required: [true, "Password is must required"],
  },
  profilePic: {
    type: String,
    default: function () {
      console.log("Gender:", this.gender); // Debugging: Log the gender value
      if (this.gender == "Female") {
        console.log("Default Female Profile Pic"); // Debugging: Log when defaulting to female profile pic
        return "defaultFemale.png";
      } else if (this.gender == "Male") {
        console.log("Default Male Profile Pic"); // Debugging: Log when defaulting to male profile pic
        return "defaultMale.png";
      } else {
        console.log("Default Profile Pic"); // Debugging: Log when defaulting to default profile pic
        return "default.png"; // Default for other cases
      }
    },
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

const user = mongoose.model("user", userSchema);

module.exports = user;
