const User = require("../models/User");

//handle error
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let error = { email: "", password: "" };

  //duplicate error code
  if (err.code === 11000) {
    error.email = "That email is registered already";
    return error;
  }

  //Validation errors
  if (err.message.includes("validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }

  return error;
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
    res.status(201).json(user);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
  res.send("User Created");
};
module.exports.login_post = (req, res) => {
  const { email, password } = req.body;
  res.send("User logged in");
};
