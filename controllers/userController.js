import { readUsers, writeUsers } from '../utils/dataHandler.js'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';


// function to register new user
export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // validation
        if (!username || !email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: "nama pengguna, email, dan password harus disediakan!"
            })
        }

        const users = await readUsers();

        // check duplicate username or email 
        const userExists = users.some(user => user.username === username || user.email === email); // return true / false
        if (userExists) {
            return res.status(409).json({ // 409 conflict
                status: 'fail',
                message: 'nama pengguna atau email sudah terdaftar!'
            })
        }

        // hashing password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt) // hash password with salt

        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            role: 'user', // default role 'user'
            createdAt: new Date().toISOString
        }

        users.push(newUser);
        await writeUsers(users);

        // don't send hashed password in the response
        const userWithoutPassword = {...newUser}
        delete userWithoutPassword.password;

        res.status(201).json({ // 201 created
            status: 'success',
            message: 'registrasi pengguna berhasil',
            data: { user: userWithoutPassword }
        })
    } catch (err) {
        next(err);
    }
}