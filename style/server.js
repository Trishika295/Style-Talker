import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { question, category } = req.body;
    if (!question) return res.status(400).json({ success: false, error: 'question required' });

    const systemContent = `You are a helpful fashion advisor. Category: ${category || 'general'}.`;
    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: question },
        ],
        max_tokens: 220,
      }),
    });

    if (!openaiResp.ok) {
      const errText = await openaiResp.text();
      return res.status(openaiResp.status).json({ success: false, error: errText });
    }

    const data = await openaiResp.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() || 'No answer available.';
    return res.json({ success: true, answer });
  } catch (error) {
    console.error('OpenAI error', error);
    return res.status(500).json({ success: false, error: error.message || 'server error' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));