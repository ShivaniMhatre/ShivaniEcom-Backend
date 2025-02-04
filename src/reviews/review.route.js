import express from 'express'
import { GetAllReview, GetReviewByUser, PostReview } from './review.controller.js'

const router = express.Router()

router.post('/postReview', PostReview);
router.get('/totalReviews', GetAllReview);
router.get('/:userId', GetReviewByUser)
export default router