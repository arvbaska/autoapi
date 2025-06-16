import * as functions from 'firebase-functions/v1';
import express, { Request, Response } from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import * as admin from 'firebase-admin';
import { defineSecret } from 'firebase-functions/params';

const OPENAI_API_KEY = defineSecret('OPENAI_API_KEY');
admin.initializeApp();

const db = admin.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

let openaiKey: string | undefined;
try {
  openaiKey = OPENAI_API_KEY.value();
} catch {
  openaiKey = process.env.OPENAI_API_KEY;
}

const openai = new OpenAI({ apiKey: openaiKey });

app.get('/', (req: Request, res: Response) => {
  res.send('AutoAPI backend');
});

app.post('/generate', async (req: Request, res: Response) => {
  const { instruction, schema, uid } = req.body;
  if (!instruction) {
    res.status(400).json({ error: 'Missing instruction' });
    return;
  }

  try {
    const prompt = `User instruction: "${instruction}"
Parsed API schema: ${schema || 'none'}`;

    const system =
      "You are a backend engineer. Generate complete integration code for the user's request using the API schema below. Include comments, error handling, and use Axios (or fetch).";

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    });

    const code = completion.choices[0]?.message?.content || '';

    await db.collection('prompts').add({
      uid: uid || null,
      instruction,
      schema: schema || null,
      code,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ code });
  } catch (err: any) {
    console.error('OpenAI error:', err.message || err);
    res.status(500).json({ error: err.message || 'Failed to generate code' });
  }
});

export const appFunc = functions
  .runWith({ secrets: ['OPENAI_API_KEY'] })
  .https.onRequest(app);
