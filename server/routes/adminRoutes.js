const express = require('express');
const router = express.Router();
const { getAllUsers, getPlatformStats, toggleUserStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/stats', getPlatformStats);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
