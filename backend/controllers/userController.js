const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !emailId || !password) {
    return res.status(400).send({ message: "Fill all mandatory fields" });
  }

  const userExists = await User.findOne({ emailId });
  if (userExists) {
    return res.status(400).json({ message: "User Already exist" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await newUser.save();
    const tokenGen = generateToken(newUser)

    return res.status(201).json({
      message: "Thank You ! You are Registered Successfully !!",
      data: {
        firstName,
        emailId,
        tokenGen
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const loginUser = async (req, res) => {
  const { emailId, password } = req.body;
  if (!emailId || !password) {
    return res.status(400).send("Fill All the Details first! Then retry!");
  }

  const userExists = await User.findOne({ emailId });

  if (!userExists) {
    return res.status(400).send("User not found !!");
  }

  try {
    const isMatched = await bcrypt.compare(password, userExists.password);

    if (!isMatched) {
      return res.status(401).send("Incorrect Password");
    }

    return res.status(200).json({
      message: "Logged In Successfully"
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };