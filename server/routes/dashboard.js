const express = require('express');
const Note = require('../models/Note');
const Group = require('../models/Group');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    const [totalNotes, joinedGroups, user] = await Promise.all([
      Note.countDocuments({ userId: req.user.id }),
      Group.countDocuments({ members: req.user.id }),
      User.findById(req.user.id).select('aiQueriesUsed name'),
    ]);

    res.json({
      totalNotes,
      joinedGroups,
      aiQueriesUsed: user?.aiQueriesUsed || 0,
      userName: user?.name || 'Student',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
