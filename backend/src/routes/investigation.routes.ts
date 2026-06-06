import { Router } from "express";
import { prisma } from "../lib/prisma";

export const investigationRouter = Router();

// Get all investigations for a workspace
investigationRouter.get("/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;
  
  try {
    const investigations = await prisma.investigation.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: "desc" },
      include: {
        cluster: true
      }
    });
    
    res.json(investigations);
  } catch (error) {
    console.error("Error fetching investigations", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new investigation
investigationRouter.post("/", async (req, res) => {
  const { workspaceId, title, notes, tags, clusterId } = req.body;
  
  try {
    const investigation = await prisma.investigation.create({
      data: {
        workspaceId,
        title,
        notes,
        tags: tags || [],
        clusterId
      }
    });
    
    res.json(investigation);
  } catch (error) {
    console.error("Error creating investigation", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
