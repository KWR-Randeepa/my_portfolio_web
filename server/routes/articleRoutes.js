import express from 'express';
import Article from '../models/Article.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public: View published articles
router.get('/', async (req, res) => {
  const articles = await Article.find({ published: true }).sort({ createdAt: -1 });
  res.json(articles);
});

// Public: View single article
router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug, published: true });
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

// Protected: Admin views all (drafts + published)
router.get('/admin/all', verifyToken, async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });
  res.json(articles);
});

// Protected: Create
router.post('/', verifyToken, async (req, res) => {
  const newArticle = new Article(req.body);
  await newArticle.save();
  res.status(201).json(newArticle);
});

// Protected: Update
router.put('/:id', verifyToken, async (req, res) => {
  const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Protected: Delete
router.delete('/:id', verifyToken, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: 'Article deleted successfully' });
});

export default router;