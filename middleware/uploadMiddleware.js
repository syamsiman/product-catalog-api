import multer from 'multer';
import path from 'path';

// konfig penyimpanan untuk multer 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // tentukan folder tujuan untuk menyimpan file yang diupload 
        // cb(null, 'public/uploads') berarti simpan di public/upload
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        // buat nama file untuk mencegah conflict 
        // contoh: namaFile-1234.jpg
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// filter file berdasarkan jenis MIME (contoh: hanya gambar)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // regex for file type
    const mimetype = fileTypes.test(file.mimetype); // cek jenis mimetipe
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()) //cek extensi file

    if (mimetype && extname) {
        return cb(null, true) // izinkan upload
    } else {
        cb(new Error("hanya file  (JPG, JPEG, PNG, GIF) yang diizinkan!"), false); // Tolak upload
    }
}

// inisialisasi multer dengan konfig diatas
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // batasi ukuran file hingga 5mb
    },
    fileFilter
})

// middleware untuk single file upload
export const uploadProductImage = upload.single("image"); // 'image' adalah nama field di form