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
import {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  validate
} from '../middleware/validationMiddleware.js'

const productRoutes = Router();

// route for /api/products
productRoutes.route("/")
.get(protect, getAllProducts)
.post(protect, authorizeRoles('admin'), uploadProductImage, createProductValidation, validate, createProduct);

// route for /api/products/:id
productRoutes.route('/:id')
.get(protect, productIdValidation, validate, getProductById)
.put(protect, authorizeRoles("admin"), uploadProductImage, productIdValidation, validate, updateProduct)
.delete(protect, authorizeRoles("admin"), productIdValidation, validate, deleteProduct)

export default productRoutes;