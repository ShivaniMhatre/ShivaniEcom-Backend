import { CURSOR_FLAGS } from "mongodb";
import Order from "../orders/order.model.js";
import User from "../Users/user.model.js";
import Review from "../reviews/review.model.js";
import Product from "../Products/product.model.js";


//User Stats
export const UserStatsByEmail = async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //sum of all orders
        const totalPaymentsResult = await Order.aggregate([
            { $match: { email: email } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ])
        const totalPaymentsAmount = totalPaymentsResult.length > 0 ? totalPaymentsResult[0].totalAmount : 0;

        //get total review
        const totalReview = await Review.countDocuments({ userId: user._id })

        //total purchase product
        const purchasedProducts = await Order.distinct("products.productId", { email: email })
        const totalPurchasedProduct = purchasedProducts.length;

        res.status(200).json({
            totalPayment: totalPaymentsAmount.toFixed(2),
            totalReview,
            totalPurchasedProduct
        })
    } catch (error) {
        console.error("Error fetching user stats ", error);
        res.status(500).send({ message: "Failed to delete order" });
    }
}

//Admin Stats
export const AdminStats = async (req, res) => {
    try {
        const totalUser = await User.countDocuments();
        const totalProduct = await Product.countDocuments();
        const totalOrder = await Order.countDocuments();
        const totalReview = await Review.countDocuments();

        //Calculate Earning
        const totalEarningResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$amount" }
                }
            }
        ])
        const totalEarnings = totalEarningResult.length > 0 ? totalEarningResult[0].totalEarnings : 0

        //monthly earning result
        const monthlyEarningsResult = await Order.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    monthlyEarnings: { $sum: "$amount" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
        ]);

        //format monthly earning
        const monthlyEarnings = monthlyEarningsResult.map((entry) => ({
            month: entry._id.month,
            year: entry._id.year,
            earnings: entry.monthlyEarnings.toFixed(2)
        }))

        res.status(200).json({
            totalOrder,
            totalProduct,
            totalReview,
            totalUser,
            totalEarnings,
            monthlyEarnings
        })
    } catch (error) {
        console.error("Error fetching admin stats", error);
        res.status(500).send({ message: "Failed to delete order" });
    }
}