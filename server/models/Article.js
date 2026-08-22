import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  readTime: { type: String, default: '5 min' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Article', ArticleSchema);