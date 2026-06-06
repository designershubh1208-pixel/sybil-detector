import { Router } from "express";
import { prisma } from "../lib/prisma";
import { analysisQueue } from "../queues/analysis.queue";

export const analysisRouter = Router();

// Endpoint to upload wallets and start analysis
analysisRouter.post("/upload", async (req, res) => {
  const { workspaceId, name, wallets } = req.body;

  if (!workspaceId || !wallets || !Array.isArray(wallets)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    // Ensure the stub workspace exists so we don't hit a Foreign Key violation
    const workspace = await prisma.workspace.upsert({
      where: { id: workspaceId },
      update: {},
      create: { id: workspaceId, name: "Default Workspace" }
    });

    // Create new Analysis record
    const analysis = await prisma.analysis.create({
      data: {
        workspaceId: workspace.id,
        name: name || `Analysis ${new Date().toISOString()}`,
        totalWallets: wallets.length,
      },
    });

    // We can insert wallets in bulk if needed, or queue the job and let the worker handle it.
    // Let's create the WalletAnalysis stub entries:
    // Ensure wallets exist
    for (const address of wallets) {
      await prisma.wallet.upsert({
        where: { address },
        update: {},
        create: { address },
      });
    }

    await prisma.walletAnalysis.createMany({
      data: wallets.map((address) => ({
        analysisId: analysis.id,
        address,
      })),
      skipDuplicates: true,
    });

    // Add job to Queue
    await analysisQueue.add("analyze", {
      analysisId: analysis.id,
      workspaceId,
      wallets,
    });

    res.json({ success: true, analysisId: analysis.id });
  } catch (error) {
    console.error("Error starting analysis:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Endpoint to get all analyses for a workspace
analysisRouter.get("/", async (req, res) => {
  const workspaceId = req.query.workspaceId || "workspace-1";
  try {
    const analyses = await prisma.analysis.findMany({
      where: { workspaceId: String(workspaceId) },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { wallets: true, clusters: true }
        }
      }
    });
    res.json(analyses);
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Endpoint to get analysis status
analysisRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        clusters: {
          include: {
            wallets: {
              include: {
                wallet: {
                  include: {
                    trustScores: true
                  }
                }
              }
            }
          }
        },
      },
    });

    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
