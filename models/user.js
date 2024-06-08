const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/socialMedia");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  gender: String,
  email: String,
  password: String,
  profilePic: {
  type: String,
  default: function() {
    console.log("Gender:", this.gender); // Debugging: Log the gender value
    if (this.gender == 'Female') {
      console.log("Default Female Profile Pic"); // Debugging: Log when defaulting to female profile pic
      return 'defaultFemale.png';
    } else if (this.gender == 'Male') {
      console.log("Default Male Profile Pic"); // Debugging: Log when defaulting to male profile pic
      return 'defaultMale.png';
    } else {
      console.log("Default Profile Pic"); // Debugging: Log when defaulting to default profile pic
      return 'default.png'; // Default for other cases
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