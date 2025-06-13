const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

const chatHistory = [];

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { chatHistory });
});

app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt;
  const promptWithInstruction = prompt + ' (jawab dengan bahasa Indonesia)';

  try {
    const result = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          { role: 'user', content: promptWithInstruction }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = result.data.choices[0].message.content;

    chatHistory.push({ prompt, response: aiResponse });

    res.render('index', { chatHistory });
  } catch (error) {
    console.error(error);
    chatHistory.push({ prompt, response: '⚠️ Terjadi kesalahan saat menghubungi AI.' });
    res.render('index', { chatHistory });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
