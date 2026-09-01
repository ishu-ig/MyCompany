const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/BlogController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Admin routes
router.use(protect);
router.use(authorize('admin'));
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
