const User = require("../models/User");
const jwt = require("jsonwebtoken");

//handle error
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let error = { email: "", password: "" };

  //duplicate error code
  if (err.code === 11000) {
    error.email = "That email is registered already";
    return error;
  }
  //incorresct email
  if ((error.message = "Incorrect email")) {
    error.email = "Not registered";
  }
  //password
  if ((error.message = "Incorrect email")) {
    error.password = "Incorrect password";
  }

  //Validation errors
  if (err.message.includes("validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }

  return error;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret mayne", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * maxAge,
    });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const err = handleErrors(error);
    res.status(400).json({ errors: err });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
