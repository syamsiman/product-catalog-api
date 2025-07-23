import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { uploadProductImage } from "../middleware/uploadMiddleware.js";

const productRoutes = Router();

// route for /api/products
productRoutes.route("/")
.get(protect, getAllProducts)
.post(protect, authorizeRoles('admin'), uploadProductImage, createProduct);

// route for /api/products/:id
productRoutes.route('/:id')
.get(protect, getProductById)
.put(protect, authorizeRoles("admin"), uploadProductImage, updateProduct)
.delete(protect, authorizeRoles("admin"), deleteProduct)

export default productRoutes;