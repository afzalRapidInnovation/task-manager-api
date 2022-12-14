const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const auth = async (req, res, next) => {
  console.log("Auth middleware");
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded :", decoded);
    console.log(`'${decoded._id}'`);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    console.log("User :", user);

    if (!user) {
      throw new Error("User not found");
    }
    req.token = token;
    req.user = user;
    console.log("Token: " + req.token);
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = {
  auth,
};