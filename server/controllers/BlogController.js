const Blog = require('../models/Blog');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.floor(1000 + Math.random() * 9000)
  );
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const { category, keyword, page = 1, limit = 9 } = req.query;
    const query = { status: 'published' };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limitNum);

    return sendSuccess(res, 'Blogs retrieved', blogs, 200, {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blog by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return sendError(res, 'Blog post not found', 404);
    }
    blog.views += 1;
    await blog.save();

    return sendSuccess(res, 'Blog retrieved', blog);
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private (Admin)
const createBlog = async (req, res, next) => {
  try {
    const { title, thumbnail, category, content, author, tags, status } = req.body;
    if (!title || !content || !category) {
      return sendError(res, 'Title, content, and category are required', 400);
    }

    const slug = generateSlug(title);
    const blog = await Blog.create({
      title,
      slug,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600',
      category,
      content,
      author: author || req.user.name,
      tags: tags || [],
      status: status || 'published',
    });

    return sendSuccess(res, 'Blog created successfully', blog, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
      return sendError(res, 'Blog not found', 404);
    }
    return sendSuccess(res, 'Blog updated successfully', blog);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return sendError(res, 'Blog not found', 404);
    }
    return sendSuccess(res, 'Blog deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};