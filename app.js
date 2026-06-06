const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Post } = require('./models');
const authenticateToken = require('./middleware/auth');

const app = express();
app.use(express.json());

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User berhasil didaftarkan', userId: user.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Password salah' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login berhasil', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  const posts = await Post.findAll({ include: [{ model: User, as: 'author', attributes: ['name', 'email'] }] });
  res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    include: [{ model: User, as: 'author', attributes: ['name', 'email'] }]
  });
  if (!post) return res.status(404).json({ error: 'Post tidak ditemukan' });
  res.json(post);
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.create({ content, authorId: req.user.id });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post tidak ditemukan' });
    
    // Validasi AuthorId
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Akses ditolak. Anda bukan pembuat post ini.' });
    }

    post.content = req.body.content;
    await post.save();
    res.json({ message: 'Post berhasil diupdate', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post tidak ditemukan' });

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Akses ditolak. Anda bukan pembuat post ini.' });
    }

    await post.destroy();
    res.json({ message: 'Post berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;