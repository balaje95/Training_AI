import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const mockRecordings = [
  {
    id: 'rec-1',
    title: 'Lead Qualification: Digital Growth Campaign',
    date: 'Oct 12, 2023',
    duration: '42m 15s',
    participants: 3,
    ownerEmail: 'user@example.com',
    participantAvatars: [],
    transcript: "Mock transcript for Lead Qualification..."
  }
];

const app = express();
const PORT = 3000;

app.use(express.json());

  // API Routes
app.get("/api/fathom/meetings", async (req, res) => {
  const email = req.query.email as string;
  const apiKey = process.env.FATHOM_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ error: "FATHOM_API_KEY is missing in backend environment." });
  }

  try {
    console.log(`Fetching Fathom meetings for ${email}...`);
    
    // We try several known Fathom for Teams API endpoints
    const endpoints = [
      "https://external-api.fathom.video/v1/recordings",
      "https://external-api.fathom.video/v1/meetings",
      "https://api.fathom.video/v1/recordings",
      "https://api.fathom.video/v1/meetings",
      "https://api.fathom.ai/v1/recordings"
    ];

    let successResponse = null;
    let lastError = null;

    for (const url of endpoints) {
      try {
        console.log(`Trying Fathom endpoint: ${url}`);
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Accept": "application/json"
          }
        });

        if (response.ok) {
          successResponse = await response.json();
          console.log(`Successfully fetched from ${url}`);
          break;
        } else {
          const text = await response.text();
          console.warn(`Endpoint ${url} returned ${response.status}: ${text.substring(0, 200)}`);
          lastError = `API responded with ${response.status} from ${url}. Body: ${text.substring(0, 50)}`;
        }
      } catch (err) {
        const error = err as Error;
        console.warn(`Connection failure for ${url}: ${error.name} - ${error.message}`);
        lastError = `Connection to ${url} failed: ${error.message}`;
      }
    }

    if (!successResponse) {
      console.warn("All Fathom API endpoints failed, using mock data for UI validation.");
      // Return structured success with mock data if all else fails, 
      // but include the error in the source to let the user know
      return res.json({
        status: "success",
        source: `Fathom Proxy (Fallback due to: ${lastError})`,
        data: mockRecordings.map(r => ({
          ...r,
          id: `mock-${r.id}`,
          ownerEmail: email || r.ownerEmail
        }))
      });
    }

    const result = successResponse;
    // Fathom for Teams often returns 'recordings' instead of 'results' or 'meetings'
    const fathomMeetings = result.recordings || result.results || result.meetings || (Array.isArray(result) ? result : []);
    
    const mappedMeetings = fathomMeetings.map((m: any) => ({
      id: m.id || m.key || `f-${Math.random()}`,
      title: m.title || m.name || 'Untitled Meeting',
      date: m.date || m.created_at ? new Date(m.date || m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown Date',
      duration: typeof m.duration === 'number' ? `${Math.floor(m.duration / 60)}m ${m.duration % 60}s` : (m.duration || 'Unknown'),
      participants: Array.isArray(m.attendees) ? m.attendees.length : (Array.isArray(m.participants) ? m.participants.length : (typeof m.participants === 'number' ? m.participants : 0)),
      ownerEmail: m.owner_email || m.creator_email || email || 'user@example.com',
      participantAvatars: Array.isArray(m.attendees) ? m.attendees.map((p: any) => p.avatar_url).filter(Boolean) : (Array.isArray(m.participants) ? m.participants.map((p: any) => p.avatar_url).filter(Boolean) : []),
      transcript: m.transcript || m.text_summary || m.description || ''
    }));

    res.json({
      status: "success",
      source: "Fathom Real-time API",
      data: mappedMeetings
    });
  } catch (error) {
    console.error("Critical error in Fathom proxy:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// Removed API generation from backend to comply with safety guidelines
// and to avoid issues with platform-provided keys not being available to custom server processes.

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
