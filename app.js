require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const postModel = require("./models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("./models/user");
const upload = require("./config/multerConfig");
const path = require("path");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", async (req, res) => {
  try {
    // Fetch users and posts
    let users = await userModel.find({});
    let posts = await postModel.find({}).populate("user");

    // Check for token in cookies
    let token = req.cookies.token;
    let user = null;

    // If token exists, fetch the user
    if (token) {
      const decoded = jwt.verify(token, "sanmitsuthar");
      user = await userModel
        .findOne({ email: decoded.email })
        .populate("posts");
    }

    // Render home template with appropriate data
    res.render("home", { users, posts, token, user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/profile/upload", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  res.render("profileUpload", { user });
  // res.render("profileUpload");
});

app.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
  // console.log(req.file);
  let user = await userModel.findOne({ email: req.user.email });

  // Check if a new file has been uploaded
  if (req.file) {
    user.profilePic = req.file.filename;
  }

  // Update the name
  if (req.body.name) {
    user.name = req.body.name;
  }

  // Save the user document with updated details
  await user.save();

  res.redirect("/profile");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  // console.log(req.user);
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  // console.log(user.posts);
  res.render("profile", { user });
});

app.get("/profile/:id", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ _id: req.params.id }).populate("posts");
  res.render("profileAnother", { user });
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");
  // console.log(req.user);

  if (post.likes.indexOf(req.user.userid) == -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }

  await post.save();
  res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");

  res.render("edit", { post });
});

app.post("/edit/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content },
    { edit: true }
  );
  res.redirect("/profile");
});

app.post("/post", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  let { content } = req.body;
  let post = await postModel.create({
    user: user._id,
    content,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

app.get("/delete/:id", async (req, res) => {
  let id = req.params.id;
  let deletedUser = await postModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/profile");
});

app.post("/register", async (req, res) => {
  let { name, username, email, password, gender } = req.body;

  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("User already registered..!!");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        name,
        username,
        email,
        password: hash,
        gender,
      });

      let token = jwt.sign({ email: email, userid: user._id }, "sanmitsuthar");
      res.cookie("token", token);
      // res.send("Registered!!");
      res.redirect("login");
    });
  });
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("Something went wrong!");

  bcrypt.compare(password, user.password, (err, result) => {
    // console.log(result);
    if (result) {
      let token = jwt.sign({ email: email, userid: user._id }, "sanmitsuthar");
      res.cookie("token", token);
      return res.status(200).redirect("/profile");
    } else {
      res.redirect("/login");
    }
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

// Protected route Middleware
function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") {
    return res.send("You must be loggedIn");
  } else {
    let data = jwt.verify(req.cookies.token, "sanmitsuthar");
    req.user = data;
    next();
  }
}

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
