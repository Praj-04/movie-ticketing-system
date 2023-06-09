const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.send(error(400, "All fields are required"));
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send(error(409, "User already present, try another email"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashedPassword });

    return res.send(success(201, "User created successfully"));
  } catch (error) {
    return res.send(error);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(400, "All fields are required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.send(
        error(
          404,
          "User not registered. Click the Signup link below to register!"
        )
      );
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return res.send(error(403, "Password incorrect!"));
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, { accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "logged out successfully!"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

const refreshAccessTokenController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.send(error(401), "refresh token is required");
  }
  const refreshToken = cookies.jwt;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const _id = decoded._id;
    const accessToken = generateAccessToken({_id})
    return res.send(success(201,{accessToken}))
  } catch (e) {
    return res.send(error(401,"Invalid refresh Token or refresh token expired!"))
  }
};

module.exports = {
  signupController,
  loginController,
  generateAccessToken,
  generateRefreshToken,
  logoutController,
  refreshAccessTokenController
};
