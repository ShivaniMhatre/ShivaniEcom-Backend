import mongoose, { model, Schema } from "mongoose";

const orderSchema = new Schema({
    orderId: String,
    products: [{
        productId: { type: String, required: true },
        quantity: { type: String, required: true },
    }],
    amount: Number,
    email: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "completed"],
        default: "pending"
    }
}, { timestamps: true })

const Order = new model('Order', orderSchema);
export default Order