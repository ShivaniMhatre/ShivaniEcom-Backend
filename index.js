import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRoutes from './src/Users/user.route.js';
import productRoutes from './src/Products/product.route.js'
import reviewRoutes from './src/reviews/review.route.js'
import orderRoutes from './src/orders/order.route.js'
import statsRoutes from './src/stats/stats.route.js'
import uploadImage from './src/utils/uploadImage.js';


dotenv.config();

const app = express()
//middleware setup
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: 'https://shivani-ecom-frontend.vercel.app',
    credentials: true
}));

app.listen(5000, () => {
    console.log("Server running on port 5000!!!")
})

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(() => {
        console.log("Error connecting to MongoDB")
    })
app.get("/", (req, res) => {
    res.send("shivani E-commerce Server is running....!");
});

//all route
app.use('/api/auth', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/review', reviewRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/stats', statsRoutes)




// Image upload route
app.post('/uploadimage', async (req, res) => {
    try {
        console.log("Received image data:", req.body.image);
        if (!req.body.image) {
            return res.status(400).json({ error: "Image data is required" });
        }

        const url = await uploadImage(req.body.image);
        res.json({ imageUrl: url });
    } catch (error) {
        console.error("Image Upload Error:", error);  // <-- Log full error
        res.status(500).json({ error: "Failed to upload image", details: error.message });
    }
});


