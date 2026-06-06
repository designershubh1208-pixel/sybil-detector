import { Router } from "express";
import { prisma } from "../lib/prisma";

export const alertsRouter = Router();

// Get all alerts for a workspace
alertsRouter.get("/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;
  
  try {
    const alerts = await prisma.alert.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 50 // Limit to latest 50
    });
    
    res.json(alerts);
  } catch (error) {
    console.error("Error fetching alerts", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark alert as read
alertsRouter.post("/:alertId/read", async (req, res) => {
  const { alertId } = req.params;
  
  try {
    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: { isRead: true }
    });
    
    res.json(alert);
  } catch (error) {
    console.error("Error marking alert as read", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
