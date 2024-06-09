const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

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
      console.log("Gender:", this.gender);
      if (this.gender == "Female") {
        return "defaultFemale.png";
      } else if (this.gender == "Male") {
        return "defaultMale.png";
      } else {
        return "default.png";
      }
    },
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
