import {readFile, writeFile} from "fs/promises"
import path from "path"

// mendapatkan path absolute ke folder 'data'
const dataFolderPath = path.resolve("data")

/**
 * Membaca data dari file JSON tertentu.
 * @param {string} filename Nama file JSON (contoh: 'products.json', 'users.json').
 * @returns {Promise<Array>} Promise yang resolve dengan array data.
 */

export const readData = async (filename) => {
    const filePath = path.join(dataFolderPath, filename);
    try {
        const data = await readFile(filePath, 'utf-8')
        return JSON.parse(data); // ubah object ke json
    } catch (error) {
        // Jika file tidak ditemukan atau isinya kosong/invalid JSON,
        // kembalikan array kosong sebagai default.
        if (error.code === 'ENOENT' || error.name === 'SyntaxError') {
            return [];
        }

        console.error(`error reading data from ${filename}`, error)
        throw error // lempar error lain yang tidak di antisipasi
    }
}

/**
 * Menulis data array ke file JSON tertentu.
 * @param {string} filename Nama file JSON (contoh: 'products.json', 'users.json').
 * @param {Array} data Array data yang akan ditulis.
 * @returns {Promise<void>} Promise yang resolve ketika penulisan selesai.
 */

export const writeData = async (filename, data) => {
    const filePath = path.join(dataFolderPath, filename) // menentukan folder tempat menyimpan data
    try {
        await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
        console.error(`error writing data to ${filename}`, error)
        throw error;
    }
}

// fungsi spesifik untuk user 
export const readProducts = async () => readData("products.json")
export const writeProducts = async (data) => writeData("products.json", data);


// fungsi spesifik untuk user 
export const readUsers = async () => readData("users.json")
export const writeUsers = async (data) => writeData("users.json", data);
