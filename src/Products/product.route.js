import express from 'express'
import {
    createProduct,
    DeleteProduct,
    GetAllProduct,
    GetSingleProduct,
    RelatedProduct,
    UpdateProduct
} from './product.controller.js'
import verifyToken from '../middleware/verifyToken.js'
import verifyAdmin from '../middleware/verifyAdmin.js'

const router = express.Router()

router.post('/createProduct', createProduct)
router.get('/', GetAllProduct)
router.get('/:id', GetSingleProduct);
router.patch('/updateProduct/:id', verifyToken, verifyAdmin, UpdateProduct)
router.delete('/:id', DeleteProduct);
router.get('/relatedProduct/:id', RelatedProduct)
export default router