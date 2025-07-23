// import { uuid } from "uuidv4";
import { readProducts, writeProducts } from "../utils/dataHandler.js";
import {v4 as uuidv4} from 'uuid';
import multer from "multer";
import fs from 'fs/promises';
import path from "path";

// function get all products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await readProducts();
        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        })
    } catch (error) {
        next(error)
    }
}

// function to get product by id
export const getProductById = async (req, res, next) => {
    try {
        const products = await readProducts()
        const product = products.find(p => p.id === req.params.id)

        if (!product) {
            return res.status(404).json({
                status: 'fail',
                message: "produk tidak ditemukan!"
            })
        }

        res.status(200).json({
            status: "success",
            data: { product }
        })
    } catch (error) {
        next(error)
    }
} 

// function to create new product 
export const createProduct = async (req, res, next) => {
    const {
        name,
        description,
        category,
        price
    } = req.body;

    try {
        const newProduct = {
            id: uuidv4(),
            name,
            description,
            price: parseFloat(price),
            category,
            // tambah jalur gambar jika ada file yang diupload
            image: req.file ? `/uploads/${req.file.filename}` : null,
            createdAt: new Date().toISOString,
            updatedAt: new Date().toISOString
        }

        const products = await readProducts(); // mendapatkan semua product
        products.push(newProduct);
        await writeProducts(products);
    
        res.status(201).json({ // 201 Created
            status: 'success',
            message: 'Produk berhasil dibuat!',
            data: { product: newProduct }
        });

    } catch (error) {
    //    multer error handling (jika filter file atau ukuran file tidak sesuai)
        if (error instanceof multer.MulterError) {
            return res.status(400).json({
                status: 'fail',
                message: error.message
            })
        } else {
            next(error)
        }
    }
}

// function to update product
export const updateProduct = async (req, res, next) => {
    try {
        const products = await readProducts();
        const productIndex = products.findIndex(p => p.id === req.params.id);

        if (productIndex === -1) { // jika tidak ada
            return res.status(404).json({
                status: "fail",
                message: "produk tidak dapat ditemukan"
            })
        }

        const currentProduct = products[productIndex];

        const updatedProduct = {
            ...currentProduct, // ambil data product berdasarkan index
            ...req.body,
            id: req.params.id, // memastikan email tetap sama
            updatedAt: new Date().toISOString()
        }

        // jika ada file gambar baru yang diupload, perbarui properti image
        if (req.file) {
            updatedProduct.image = `/uploads/${req.file.filename}`;
            // (opsional) hapus file lama jika ada, untuk menghindari penumpukan
            if (currentProduct.image) {
                fs.unlink(path.join(path.resolve('public'), currentProduct.image), err => {
                    if (err) console.error('Error deleting old image', err);
                })
            }
        }

        products[productIndex] = updatedProduct;
        await writeProducts(products)

        res.status(200).json({
            status: 'success',
            message: 'produk berhasil diperbarui',
            data: { product: updatedProduct }
        })
    } catch (error) {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({
                status: 'fail',
                message: error.message
            });
        }
        next(error);
    }
}

// function to delete product
export const deleteProduct = async (req, res, next) => {
    try {
        let products = await readProducts();
        const initialLength = products.length;
        products = products.filter(p => p.id !== req.params.id);

        if (products.length === initialLength) {
            // jika panjang array tidak berubah maka product tidak ditemukan
            return res.status(404).json({
                status: 'fail',
                messsage: "produk tidak ditemukan untuk dihapus"
            })
        }

        await writeProducts(products);

        res.status(204).send(); //204 no content, respons berhasil tanpa body
    } catch (err) {
        next(err);
    }
}