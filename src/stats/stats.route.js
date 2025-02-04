import express from 'express';
import { AdminStats, UserStatsByEmail } from './stats.controller.js';

const router = express.Router()

//user stats by email
router.get('/userStats/:email', UserStatsByEmail)
router.get('/adminStats', AdminStats)
export default router