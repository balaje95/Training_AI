import { Recording, Step, PipelineType } from './types';
import { GoogleGenAI, Type } from "@google/genai";

// Mock data for Fathom meetings
export const mockRecordings: Recording[] = [
  {
    id: 'rec-1',
    title: 'Lead Qualification: Digital Growth Campaign',
    date: 'Oct 12, 2023',
    duration: '42m 15s',
    participants: 3,
    ownerEmail: 'bnprasanna95@gmail.com',
    participantAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCF1Kqz60nbNEX1yh0dno4iHIkP3NHBkKmDf51yrerIckv_JaCcoRQUB2YxdeLsADtrYaDtxlQnbAy4bvneghe0NVvT-koGoDMiF4vC5Ap6Tbln9ZIrQH7rJcboqgRyUP_arlWjftgPXYENDgbYgfGdyL3kxQZ-AbViHjJ5Zh47Tjef6UiO_l3AhXURthaHkR8RVC7XyBqI2SWq80O3FqDyXhv5gLndpLCHLNk1f5Y5dS5prkCxP7kXbtkbMbEuwKR-qmG_SJDw3Hw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOj2BxRY5b5X-yMUM1-XnTrmGC69v5jmmQxURTSJrgs-hA3jYB6Rh0S13XzckhxHOQin_bWoaYrqTN4SsIfkE6QuHGo03q_Q9WPqjv6SKEpYFz1h0lgB7sTCVPHS7oTlTTN_fsXUTDrq8gjujC9FnSm0rvnY9LFpGHp3fxSSgRkvk6pGXKwTVBJzar065QjVhSzF5u8wzm0in6Xn3t5kgIvjXrKEq_gwUybXRhtrGQR9-ZSZotujIPJfPEep2k4Q0oZ5qThEUJz5I'
    ],
    transcript: `Jane Doe (00:45): "Thanks everyone for joining. We're qualifying NewCorp for the growth campaign. What's their current budget range?"\n\nAlex Miller (01:12): "They mentioned between $50k and $75k for the initial phase. Their main pain point is customer retention in the EMEA region."\n\nJane Doe (01:25): "Understood. Let's detail the proposal steps. First, we need to audit their existing CRM..."`
  },
  {
    id: 'rec-2',
    title: 'Site Inspection: Warehouse B7',
    date: 'Oct 11, 2023',
    duration: '15m 00s',
    participants: 1,
    ownerEmail: 'bnprasanna95@gmail.com',
    participantAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOj2BxRY5b5X-yMUM1-XnTrmGC69v5jmmQxURTSJrgs-hA3jYB6Rh0S13XzckhxHOQin_bWoaYrqTN4SsIfkE6QuHGo03q_Q9WPqjv6SKEpYFz1h0lgB7sTCVPHS7oTlTTN_fsXUTDrq8gjujC9FnSm0rvnY9LFpGHp3fxSSgRkvk6pGXKwTVBJzar065QjVhSzF5u8wzm0in6Xn3t5kgIvjXrKEq_gwUybXRhtrGQR9-ZSZotujIPJfPEep2k4Q0oZ5qThEUJz5I'
    ],
    transcript: `Inspector (00:05): "Observing Warehouse B7. The shelving on rack 4 shows slight structural fatigue. Remediation required: reinforce base plates."`
  },
  {
    id: 'rec-3',
    title: 'Finance Review: Q4 Projections',
    date: 'Oct 10, 2023',
    duration: '58m 22s',
    participants: 2,
    ownerEmail: 'bnprasanna95@gmail.com',
    participantAvatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCF1Kqz60nbNEX1yh0dno4iHIkP3NHBkKmDf51yrerIckv_JaCcoRQUB2YxdeLsADtrYaDtxlQnbAy4bvneghe0NVvT-koGoDMiF4vC5Ap6Tbln9ZIrQH7rJcboqgRyUP_arlWjftgPXYENDgbYgfGdyL3kxQZ-AbViHjJ5Zh47Tjef6UiO_l3AhXURthaHkR8RVC7XyBqI2SWq80O3FqDyXhv5gLndpLCHLNk1f5Y5dS5prkCxP7kXbtkbMbEuwKR-qmG_SJDw3Hw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOj2BxRY5b5X-yMUM1-XnTrmGC69v5jmmQxURTSJrgs-hA3jYB6Rh0S13XzckhxHOQin_bWoaYrqTN4SsIfkE6QuHGo03q_Q9WPqjv6SKEpYFz1h0lgB7sTCVPHS7oTlTTN_fsXUTDrq8gjujC9FnSm0rvnY9LFpGHp3fxSSgRkvk6pGXKwTVBJzar065QjVhSzF5u8wzm0in6Xn3t5kgIvjXrKEq_gwUybXRhtrGQR9-ZSZotujIPJfPEep2k4Q0oZ5qThEUJz5I'
    ]
  },
  {
    id: 'rec-4',
    title: 'Production Sync: Line 2 Optimization',
    date: 'Oct 09, 2023',
    duration: '35m 10s',
    participants: 4,
    ownerEmail: 'bnprasanna95@gmail.com',
    participantAvatars: [
       'https://lh3.googleusercontent.com/aida-public/AB6AXuCF1Kqz60nbNEX1yh0dno4iHIkP3NHBkKmDf51yrerIckv_JaCcoRQUB2YxdeLsADtrYaDtxlQnbAy4bvneghe0NVvT-koGoDMiF4vC5Ap6Tbln9ZIrQH7rJcboqgRyUP_arlWjftgPXYENDgbYgfGdyL3kxQZ-AbViHjJ5Zh47Tjef6UiO_l3AhXURthaHkR8RVC7XyBqI2SWq80O3FqDyXhv5gLndpLCHLNk1f5Y5dS5prkCxP7kXbtkbMbEuwKR-qmG_SJDw3Hw'
    ]
  },
  {
    id: 'rec-5',
    title: 'Investor Pitch: Series A Preparation',
    date: 'Oct 08, 2023',
    duration: '22m 45s',
    participants: 2,
    ownerEmail: 'bnprasanna95@gmail.com',
    participantAvatars: [
       'https://lh3.googleusercontent.com/aida-public/AB6AXuBOj2BxRY5b5X-yMUM1-XnTrmGC69v5jmmQxURTSJrgs-hA3jYB6Rh0S13XzckhxHOQin_bWoaYrqTN4SsIfkE6QuHGo03q_Q9WPqjv6SKEpYFz1h0lgB7sTCVPHS7oTlTTN_fsXUTDrq8gjujC9FnSm0rvnY9LFpGHp3fxSSgRkvk6pGXKwTVBJzar065QjVhSzF5u8wzm0in6Xn3t5kgIvjXrKEq_gwUybXRhtrGQR9-ZSZotujIPJfPEep2k4Q0oZ5qThEUJz5I'
    ]
  }
];


export async function searchFathomRecordings(email: string): Promise<Recording[]> {
  try {
    const response = await fetch(`/api/fathom/meetings?email=${encodeURIComponent(email)}`);
    const result = await response.json();
    
    if (result.error) {
      console.warn("Fathom API Proxy Error:", result.error);
      return [];
    }
    
    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch meetings from proxy:", error);
    return [];
  }
}

export async function generateGuideFromTranscript(
  recording: Recording,
  pipeline: PipelineType = 'General',
  customerName: string = 'Our Customer'
): Promise<{ title: string, steps: Step[] }> {
  // Use platform-provided Gemini key
  const geminiKey = process.env.GEMINI_API_KEY;
  
  if (!geminiKey || geminiKey === "undefined" || geminiKey === "") {
    console.error("GEMINI_API_KEY is missing or invalid in the frontend bundle.");
    throw new Error('AI Generation is temporarily unavailable. Please ensure your Gemini API key is configured in the environment.');
  }

  const ai = new GoogleGenAI({ apiKey: geminiKey });
  
  const pipelineInstructions: Record<PipelineType, string> = {
    'Lead Qualification': 'Focus on discovery questions, identified pain points, budget discussions, and specific next steps for the sales cycle. Ensure the output is structured for a sales representative.',
    'Inspection': 'Focus on technical specifications, anomalies or issues identified during the walkthrough, and clear remediation instructions. Highlight safety and compliance.',
    'Production': 'Focus on the operational workflow, material requirements, production timelines, and quality control checkpoints. Tailor it for factory floor staff.',
    'Finance': 'Focus on contract terms, pricing structures, ROI arguments, and specific compliance or regulatory requirements discussed. Use professional accounting and legal terminology.',
    'General': 'Create a standard step-by-step training manual based on the meeting events.'
  };

  const prompt = `
    Transform the following meeting data into a professional step-by-step training manual.
    
    Pipeline Category: ${pipeline}
    Customer Reference: ${customerName}
    Specific Goal: ${pipelineInstructions[pipeline] || pipelineInstructions['General']}
    
    Meeting Details:
    - Title: ${recording.title}
    - Transcript Snippet: ${recording.transcript || "No transcript available"}
    
    Manual Requirements:
    1. Title must be descriptive: "[${pipeline}] Manual for ${customerName}"
    2. Minimum of 4 steps if possible.
    3. Each step must have: title, timestamp (MM:SS), detailed description (at least 2 paragraphs if complex), and a sequential id.
    4. Maintain a teaching, professional tone.
    
    Return STRICT JSON:
    {
      "title": "Manual Title",
      "steps": [
        { "id": "1", "title": "...", "timestamp": "...", "description": "..." }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["id", "title", "timestamp", "description"]
              }
            }
          },
          required: ["title", "steps"]
        }
      }
    });

    const data = JSON.parse(response.text);
    
    // Inject visual assets (mocked placeholders that work in this environment)
    const assets = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBudoaTPDPFl1zWllB6kyELijE17nMEVy7AJiFkKTRzB4u3nOcQpTCnb9nZtEo71cg7u78KzcsxooVJ12hkME5XV37Qbx9MTuV0gRu_LBmjEfaIZ0EP73KSTBSYrhEn3VlJFOGKfFZJ4jK3fErFLv1PiW5Svp1E0e_BW3pn2C82UyxQCxgNryWv5Y3s8-150ddDbN3vomufTT7TmiOh3IIHTDBs-I-YOVvLF9qKVDoAcYF2dO3h9wu5KBY8QOU8MMcENWzICYDZfmg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBr9EI9a1BWvzXxXTwlyNtaHpod362WzoZEfzU9-WrUtFzy8FG1s24UTfG8nL-tXAKdS1wLzI4NCnN-rkflF64mTp5v-FUh8px5RucuHuXx2J-CNB4FcjKqmKvJlQbYPhlnSyh9YSsPVJ-K5LOgVVRp1_yyOjPF8z9M6Kpfyn4ZR0MFACN4ShYQM2x8UXFu2EdV2htRvNqzkl98zJMBs_by8mTwriItSYBxhHsmdoQhpS8Gl8Au2lca2fM42J3wBWy-LSF2jYacSc',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6SDrp-Ia8nBIoYZ26xDYhHv8IOSmRSNVpkK7epbG07hF5N7I0wr8zBZrT3h4X9F2C75MIjrk5ouHSovxPDGTku6jpEISKouTflrv9c6zHb5MdKCoI3gYMuyaGGfUoskfhK5_xUfr8polZVIhtBnWIb6MhaZ_vizCTXw_XNxcfIjeptGKnFoKXJKlGMZiYPzrVHPELDOK1VpLP5qZS2GXezbmMw_QcJSuO4lsW3rnNAFGDsnaOGL7XBdCLCGPHEpVOyKWVhyQphoc'
    ];

    data.steps = data.steps.map((step: any, index: number) => ({
      ...step,
      imageUrl: assets[index % assets.length]
    }));

    return data;
  } catch (error) {
    console.error("AI Generation failed on frontend:", error);
    throw error;
  }
}
