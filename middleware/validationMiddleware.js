import { body, param, validationResult } from "express-validator";

// middleware untuk menangani hasil validasi
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next() // jika tidak ada error validasi, lanjutkan
    }
// jika ada error validasi, kirim response 400 bad request
    return res.status(400).json({
        status: 'fail',
        message: 'validasi input gagal',
        errors: errors.array().map(err => ({field: err.path, message: err.msg}))
    })
}

// aturan validasi untuk pengguna
export const registerUserValidation = [
    body('username')
        .trim() // Menghapus spasi di awal/akhir
        .notEmpty().withMessage('Nama pengguna tidak boleh kosong.')
        .isLength({ min: 3 }).withMessage('Nama pengguna minimal 3 karakter.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email tidak boleh kosong.')
        .isEmail().withMessage('Format email tidak valid.'),
    body('password')
        .notEmpty().withMessage('Password tidak boleh kosong.')
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter.')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
        .withMessage('Password harus mengandung setidaknya satu huruf, satu angka, dan satu simbol.'),
];

// Aturan untuk login pengguna
export const loginUserValidation = [
    body('email')
        .notEmpty().withMessage('Email tidak boleh kosong.')
        .isEmail().withMessage('Format email tidak valid.'),
    body('password')
        .notEmpty().withMessage('Password tidak boleh kosong.'),
];

// --- Aturan Validasi untuk Produk ---

// Aturan untuk membuat produk baru
export const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama produk tidak boleh kosong.')
        .isLength({ min: 3, max: 100 }).withMessage('Nama produk harus antara 3 hingga 100 karakter.'),
    body('description')
        .optional({ checkFalsy: true }) // Izinkan kosong/null/undefined
        .trim()
        .isLength({ max: 500 }).withMessage('Deskripsi produk maksimal 500 karakter.'),
    body('price')
        .notEmpty().withMessage('Harga produk tidak boleh kosong.')
        .isFloat({ gt: 0 }).withMessage('Harga produk harus angka positif.'),
    body('category')
        .trim()
        .notEmpty().withMessage('Kategori produk tidak boleh kosong.')
        .isLength({ min: 2, max: 50 }).withMessage('Kategori produk harus antara 2 hingga 50 karakter.'),
];

// Aturan untuk memperbarui produk
export const updateProductValidation = [
    param('id') // Validasi untuk parameter ID di URL
        .notEmpty().withMessage('ID produk tidak boleh kosong.'),
    body('name')
        .optional({ checkFalsy: true }) // Opsional, karena update tidak harus mengubah semua field
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('Nama produk harus antara 3 hingga 100 karakter.'),
    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 500 }).withMessage('Deskripsi produk maksimal 500 karakter.'),
    body('price')
        .optional({ checkFalsy: true })
        .isFloat({ gt: 0 }).withMessage('Harga produk harus angka positif.'),
    body('category')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Kategori produk harus antara 2 hingga 50 karakter.'),
];

// Aturan untuk mendapatkan/menghapus produk berdasarkan ID
export const productIdValidation = [
    param('id')
        .notEmpty().withMessage('ID produk tidak boleh kosong.')
];