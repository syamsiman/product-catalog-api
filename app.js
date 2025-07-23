import dotenv from 'dotenv';
dotenv.config(); // memuat variable dari .env ke process.env

import express from "express"
import "express-async-errors"
import productRoutes from "./routes/productRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import cookieParser from 'cookie-parser';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express()

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url); // import.meta.url = modul saat ini kemudian diubah ke path
const __dirname = path.dirname(__filename); // kemudian ambil nama direktori 

// --- Swagger Docs Setup ---
const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


// middleware dasar
app.use(express.static('public'))
app.use(express.json()) // untuk parsing json dari req body
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.send("hello")
})

// /api/products 
app.use('/api/products', productRoutes)

// /api/auth/register
app.use('/api/auth', authRoutes)


// middleware not found
app.use((req, res) => {
    res.status(404).json({
        status: 'fail',
        message: "maaf tidak dapat menemukan " + req.originalUrl
    })
})

// middleware error global
app.use((err, req, res, next) => {
    console.error(err)

    const statusCode = err.statusCode || 500;
    const message = err.message || "interal server error"

    res.status(statusCode).json({
        status: "error",
        message,
        // Di lingkungan produksi, jangan kirim stack trace!
        // Gunakan process.env.NODE_ENV untuk mengontrol ini.
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined

    })
})

app.listen(3000, () => {
    console.log("server is running on port 3000");
    console.log('api documentation available at http://localhost:3000/api-docs');
})