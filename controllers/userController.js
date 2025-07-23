import { readUsers, writeUsers } from "../utils/dataHandler.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// function to register new user
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // validation
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "nama pengguna, email, dan password harus disediakan!",
      });
    }

    const users = await readUsers();

    // check duplicate username or email
    const userExists = users.some(
      (user) => user.username === username || user.email === email
    ); // return true / false
    if (userExists) {
      return res.status(409).json({
        // 409 conflict
        status: "fail",
        message: "nama pengguna atau email sudah terdaftar!",
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // hash password with salt

    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role: "user", // default role 'user'
      createdAt: new Date().toISOString,
    };

    users.push(newUser);
    await writeUsers(users);

    // don't send hashed password in the response
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    res.status(201).json({
      // 201 created
      status: "success",
      message: "registrasi pengguna berhasil",
      data: { user: userWithoutPassword },
    });
  } catch (err) {
    next(err);
  }
};

// function to login user
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate login input
    if (!email || !password) {
      return res.status(404).json({
        status: "fail",
        message: "email dan password harus disediakan!",
      });
    }

    const users = await readUsers();

    // find a user by email
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({
        // 401 unauthorized
        status: "fail",
        message: "Email atau password salah!",
      });
    }

    // password verification
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        // 401 Unauthorized
        status: "fail",
        message: "Email atau password salah!",
      });
    }

    const userWithoutPassword = user;
    delete userWithoutPassword.password;
    // call helper function to send token as cookie 
    sendTokenResponse(userWithoutPassword, 200, res)

  } catch (error) {
    next(error); // Teruskan error ke middleware error handling global
  }
};

// helper function to make and sending JWT as cookie
const sendTokenResponse = (user, statusCode, res) => {
  // create jwt
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

//   options for cookie 
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // convert days to miliseonds
    httpOnly: true, // intercept to access cookie trough js client
  }

//   if in production, add secure: true (cookieS only send trough HTTPS) 
// if (process.env.NODE_ENV === "production") {
//     options.secure = true;
// }

// send token as cookie 
res.status(statusCode).cookie('token', token, options).json({
    status: 'success',
    token,
    data: {user}
})

};

// function to logout user (removing cookie) 
export const logoutUser = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // kadaluarsa dalam 10 detik
        httpOnly: true,
    })

    res.status(200).json({
        status: 'success',
        message: "berhasil logout"
    })
}