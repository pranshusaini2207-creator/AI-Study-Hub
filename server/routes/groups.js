const express = require('express');
const Group = require('../models/Group');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate('members', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('members', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, subject } = req.body;

    if (!name || !subject) {
      return res.status(400).json({ message: 'Group name and subject are required.' });
    }

    const createdCount = await Group.countDocuments({ createdBy: req.user.id });
    if (createdCount >= 3) {
      return res.status(400).json({ message: 'You can create a maximum of 3 groups.' });
    }

    const group = await Group.create({
      name,
      subject,
      members: [req.user.id],
      createdBy: req.user.id,
    });

    const populated = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

router.post('/join/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const alreadyMember = group.members.some((memberId) => memberId.toString() === req.user.id);
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this group.' });
    }

    group.members.push(req.user.id);
    await group.save();

    const populated = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

router.get('/recent-messages', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).select('name messages');

    const allMessages = [];
    groups.forEach((group) => {
      group.messages.slice(-3).forEach((msg) => {
        allMessages.push({
          groupName: group.name,
          userName: msg.userName,
          text: msg.text,
          createdAt: msg.createdAt,
        });
      });
    });

    allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allMessages.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

module.exports = router;
