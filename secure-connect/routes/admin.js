const express = require('express');
const User = require('../models/User');
const Note = require('../models/Note');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, authorizeRoles('admin')); // RBAC: admins only

// GET /api/admin/users
router.get('/users', async (req, res) => {
  res.json(await User.find().select('-password'));
});

// GET /api/admin/notes  (all notes across users)
router.get('/notes', async (req, res) => {
  res.json(await Note.find().populate('owner', 'username email'));
});

module.exports = router;
