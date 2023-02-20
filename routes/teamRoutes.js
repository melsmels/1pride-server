import express from 'express'
import checkAuth from '../middleware/checkAuth.js'
import { getMatches } from '../controllers/teamController.js'

const router = express.Router()

// Authentication, registration and confirmation of Users
router.get('/matches', getMatches);

export default router