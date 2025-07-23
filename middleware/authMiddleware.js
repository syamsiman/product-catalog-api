import jwt from "jsonwebtoken";
import { readUsers } from "../utils/dataHandler.js";

// middleware to protect route
export const protect = async (req, res, next) => {
  let token;

  // check if the token is in the header authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Format: 'Bearer TOKEN_NYA'
    token = req.headers.authorization.split(" ")[1];
  } 
  // if it is not in the header, check in cookie 
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // if there's no token
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "akses ditolak, token tidak ditemukan",
    });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Payload from JWT: { id: user.id, role: user.role, iat: ..., exp: ... }
    // console.log('Decoded JWT:', decoded);

    // verifying if the user data is in database
    const users = await readUsers();
    const currentUser = users.find((u) => u.id === decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "token tidak valid atau pengguna tidak lagi ada",
      });
    }

    // add user to request object (req.user)
    // so that the next cotroller or middleware can access user info
    const userForRequest = { ...currentUser };
    delete userForRequest.password;
    req.user = userForRequest;

    next();
  } catch (error) {
    // jika verifikasi token gagal (token expired, signature invalid, dll.)
    return res.status(401).json({
      status: "fail",
      message: "token tidak valid atau sudah kadaluarsa",
    });
  }
};

// authorize role
/**
 * @param {array} roles - allowed roles (e.g ["admin", "editor"])
 */

export const authorizeRoles =  (...roles) => {
  return (req, res, next) => {
    // req.user is managed by middleware 'protect'
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: 'fail',
        message: "akses ditolak. informasi peran pengguna tidak tersedia"
      })
    }

    // check if the role user is in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: "anda tidak memiliki izin untuk melakukan aksi ini"
      })
    }

    next(); // if the role is allowed, next
  }
}