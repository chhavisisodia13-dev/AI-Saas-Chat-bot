const User = require("../models/User");


// SIGNUP
const signup = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser =
    await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists"
      });

    }

    const user = await User.create({

      name,
      email,
      password

    });

    res.status(201).json({

      message: "Signup successful",
      user

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Signup failed"

    });

  }

};


// LOGIN
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user =
    await User.findOne({ email });

    if (!user) {

      return res.status(400).json({

        message: "User not found"

      });

    }

    if (user.password !== password) {

      return res.status(400).json({

        message: "Invalid password"

      });

    }

    res.status(200).json({

      message: "Login successful",
      token: "dummy-token",
      user

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: "Login failed"

    });

  }

};

module.exports = {

  signup,
  login

};