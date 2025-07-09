import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const productRoutes = Router();

// route for /api/products
productRoutes.route("/")
.get(getAllProducts)
.post(createProduct);

// route for /api/products/:id
productRoutes.route('/:id')
.get(getProductById)
.put(updateProduct)
.delete(deleteProduct)

export default productRoutes;