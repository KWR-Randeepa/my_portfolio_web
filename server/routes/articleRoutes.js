import express from 'express';
import Article from '../models/Article.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public: View published articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ published: true }).sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch published articles: ' + err.message });
  }
});

// Protected: Admin views all (drafts + published)
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin articles: ' + err.message });
  }
});

// Public: View single article
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, published: true });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch article: ' + err.message });
  }
});

// Protected: Create
router.post('/', verifyToken, async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An article with this slug already exists. Please use a unique slug.' });
    }
    res.status(400).json({ error: err.message || 'Failed to create article' });
  }
});

// Protected: Update
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Article not found for update' });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An article with this slug already exists. Please use a unique slug.' });
    }
    res.status(400).json({ error: err.message || 'Failed to update article' });
  }
});

// Protected: Delete
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Article not found for deletion' });
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete article: ' + err.message });
  }
});

export default router;