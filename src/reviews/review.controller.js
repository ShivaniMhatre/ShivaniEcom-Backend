import Product from "../Products/product.model.js";
import Review from "./review.model.js";

export const PostReview = async (req, res) => {
    try {
        const { comment, rating, productId, userId } = req.body;
    
        if (!comment || !rating || !productId || !userId) {
          return res.status(400).send({ message: "All fields are required" });
        }
        const existingReview = await Review.findOne({ productId, userId });
    
        if (existingReview) {
          //    update reviews
          existingReview.comment = comment;
          existingReview.rating = rating;
          await existingReview.save();
        } else {
          // create new review
          const newReview = new Review({
            comment,
            rating,
            productId,
            userId,
          });
          await newReview.save();
        }
    
        // calculate the average rating
        const reviews = await Review.find({ productId });
        if (reviews.length > 0) {
          const totalRating = reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          const averageRating = totalRating / reviews.length;
          const product = await Product.findById(productId);
          if (product) {
            product.rating = averageRating;
            await product.save({ validateBeforeSave: false });
          } else {
            return res.status(404).send({ message: "Product not found" });
          }
        }
    
        res.status(200).send({
          message: "Review processed successfully",
          reviews: reviews,
        });
      } catch (error) {
        res.status(500).json({
            message: "Error Occured",
            error: error.message,
            success: false
        })
    }
}

export const GetAllReview = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments({});
    res.status(200).send({totalReviews})
  }  catch (error) {
        res.status(500).json({
            message: "Error Occured",
            error: error.message,
            success: false
        })
    }
}

export const GetReviewByUser = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({
            message: "User ID is required", success: false
        })
    }
    try {
        const reviews = await Review.find({ userId: userId }).sort({ createdAt: -1 });
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found", success: false });
        }
        res.status(200).json({ reviews, success: true });
    } catch (error) {
        res.status(500).json({
            message: "Error Occured",
            error: error.message,
            success: false
        })
    }
}