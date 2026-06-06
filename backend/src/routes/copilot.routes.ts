import { Router } from "express";
import { prisma } from "../lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const copilotRouter = Router();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

copilotRouter.post("/chat", async (req, res) => {
  const { prompt, workspaceId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (!genAI) {
    return res.status(500).json({ 
      error: "Gemini API key is missing.",
      reply: "System offline: GEMINI_API_KEY is not configured in the backend environment."
    });
  }

  try {
    // 1. Gather Global Context
    // We fetch high-level metrics to feed into Gemini so it understands the global state.
    const totalAnalyses = await prisma.analysis.count({ where: { workspaceId } });
    const totalClusters = await prisma.cluster.count({ where: { analysis: { workspaceId } } });
    
    // Get the most recent high-risk clusters
    const topClusters = await prisma.cluster.findMany({
      where: { analysis: { workspaceId } },
      orderBy: { size: 'desc' },
      take: 3,
      select: {
        id: true,
        size: true,
        confidence: true,
        aiSummary: true
      }
    });

    // Get the latest 3 alerts
    const recentAlerts = await prisma.alert.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: { title: true, message: true, type: true }
    });

    // 2. Build the System Context Prompt
    const contextStr = `
You are Beacon Copilot, an elite Web3 blockchain forensic AI assistant. 
You are currently deployed inside a workspace that has performed ${totalAnalyses} total upload analyses, discovering ${totalClusters} total Sybil clusters.

Here are the top 3 largest active Sybil clusters in the database:
${topClusters.map(c => `- Cluster ID: ${c.id} | Size: ${c.size} wallets | Confidence: ${Math.round((c.confidence||0)*100)}% | Behavior: ${c.aiSummary}`).join("\n")}

Here are the 3 most recent system alerts:
${recentAlerts.map(a => `- [${a.type}] ${a.title}: ${a.message}`).join("\n")}

Instructions:
1. Answer the user's question directly based on the context above.
2. Maintain a highly professional, technical, and forensic tone (like a cybersecurity analyst).
3. If the user asks something outside the scope of blockchain security or their workspace data, politely remind them of your purpose.
4. Keep answers concise but insightful.
`;

    // 3. Generate Content
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${contextStr}\n\nUser Question:\n${prompt}` }] }]
    });

    const reply = result.response.text();
    res.json({ reply });

  } catch (error) {
    console.error("Copilot Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat query" });
  }
});
