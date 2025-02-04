import Review from "../reviews/review.model.js"
import Product from "./product.model.js"

export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product({
            ...req.body
        })

        const saveProduct = await newProduct.save()
        //calculate Reviews
        const reviews = await Review.find({ productId: saveProduct._id });
        if (reviews.length > 0) {
            const totalRating = reviews.reduce(
                (acc, review) => acc + review.rating,
                0
            );
            const avgRating = totalRating / reviews.length;
            saveProduct.rating = avgRating;
            await saveProduct.save()
        }
        res.status(201).json(saveProduct)
    } catch (error) {
        res.status(500).json({
            message: "Error creating product",
            error: error.message,
            success: false
        })
    }
}

//get all product
export const GetAllProduct = async (req, res) => {
    try {
        const { category, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        let filter = {};
        if (category && category !== 'all') {
            filter.category = category;
        }
        if (color && color !== 'all') {
            filter.color = color;
        }
        if (minPrice && maxPrice) {
            const min = parseFloat(minPrice);
            const max = parseFloat(maxPrice);
            if (!isNaN(min) && !isNaN(max)) {
                filter.price = { $gte: min, $lte: max }
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const totalProducts = await Product.countDocuments(filter);
        const totalPage = Math.ceil(totalProducts / parseInt(limit));
        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .populate("author", "email")
            .sort({ createdAt: - 1 })
        res.status(200).json({
            success: true,
            products,
            totalPage,
            totalProducts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        })
    }
}

export const GetSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate("author", "email username");
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }
        const reviews = await Review.find({ productId }).populate("userId", "username email")
        res.status(200).json({
            product,
            reviews
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching single products",
            error: error.message
        })
    }
}

export const UpdateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { ...req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating products",
            error: error.message
        })
    }
}

export const DeleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        // delete reviews related to the product
        await Review.deleteMany({ productId: productId });

        res.status(200).send({
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting products",
            error: error.message
        })
    }
}

export const RelatedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Product Id is Required" })
        }
        const product = await Product.findById(id)
        if (!product) {
            return res.status(400).json({ message: "Product Not Found" })
        }
        const titleRegex = new RegExp(
            product.name
                .split(" ")
                .filter((word) => word.length > 1)
                .join("|"),
            "i"
        );
        const relatedProduct = await Product.find({
            _id: { $ne: id },
            $or: [
                { name: { $regex: titleRegex } },//match similar name
                { category: product.category },//match same category
            ],
        })
        res.status(200).json(relatedProduct)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching related products",
            error: error.message
        })
    }
}


