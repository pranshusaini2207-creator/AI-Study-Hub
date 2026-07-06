const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

router.post('/chat', auth, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: question
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "AI Study App"
        }
      }
    );

    const answer =
      response.data?.choices?.[0]?.message?.content ||
      "No response from AI";

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { aiQueriesUsed: 1 }
    });

    const user = await User.findById(req.user.id).select('aiQueriesUsed');

    res.json({
      answer,
      aiQueriesUsed: user.aiQueriesUsed
    });

  } catch (error) {
    console.log("AI ERROR:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Failed to get AI response",
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;