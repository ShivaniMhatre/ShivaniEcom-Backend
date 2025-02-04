import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number
    },
    image: {
        type: String
    },
    color: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

const Product = new model('Product', productSchema);
export default Product