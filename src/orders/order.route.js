import express from 'express'
import { ConfirmPayment, CreateCheckoutSession, DeleteOrder, GetAllOrder, GetOrderByEmail, GetOrderById, UpdateOrderStatus } from './order.controller.js'

const router = express.Router()

router.post("/createCheckoutSession", CreateCheckoutSession)
router.post('/confirmPayment', ConfirmPayment)
router.get('/:email', GetOrderByEmail)
router.get("/order/:id", GetOrderById)
router.get('/', GetAllOrder)
router.patch('/updateOrderStatus/:id', UpdateOrderStatus)
router.delete('/deleteOrder/:id', DeleteOrder)

export default router