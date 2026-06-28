import { Router } from "express";
import { prisma } from "../lib/prisma";
import { fetchWalletTransactions, extractFeatures, calculateTrustScore } from "../lib/ml";

export const enterpriseRouter = Router();

// Middleware to check API key
enterpriseRouter.use(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(401).json({ error: "Missing x-api-key header" });
  }

  // In Phase 1, we allow a master key "beacon-enterprise-test-key" or we check DB
  if (apiKey === "beacon-enterprise-test-key") {
    return next();
  }

  const keyRecord = await prisma.apiKey.findUnique({ where: { key: apiKey } });
  if (!keyRecord) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  // Update last used
  await prisma.apiKey.update({
    where: { key: apiKey },
    data: { lastUsedAt: new Date() }
  });

  next();
});

// Airdrop Protection API - Endpoint: POST /v1/wallet/check
enterpriseRouter.post("/wallet/check", async (req, res) => {
  const { wallets, chain } = req.body;

  if (!wallets || !Array.isArray(wallets)) {
    return res.status(400).json({ error: "Invalid request. 'wallets' must be an array of addresses." });
  }

  try {
    const results = await Promise.all(wallets.map(async (address: string) => {
      const [txs, walletRecord] = await Promise.all([
        fetchWalletTransactions(address),
        prisma.walletAnalysis.findFirst({
          where: { address, clusterId: { not: null } },
        })
      ]);
      
      // 2. Extract features
      const features = extractFeatures(address, txs);

      // 3. Check if wallet belongs to any known Sybil cluster historically
      const isClustered = !!walletRecord;

      // 4. Calculate Trust Score
      const trustScoreResult = calculateTrustScore(features, isClustered);

      // 5. Store / Update Trust Score in DB
      // First ensure wallet exists
      await prisma.wallet.upsert({
        where: { address },
        update: {},
        create: { address }
      });

      await prisma.trustScore.create({
        data: {
          walletAddress: address,
          score: trustScoreResult.score,
          humanProbability: trustScoreResult.humanProbability,
          sybilRisk: trustScoreResult.sybilRisk,
          governanceRisk: trustScoreResult.governanceRisk,
          explainabilityText: trustScoreResult.explainabilityText,
        }
      });

      // 6. Format Response
      return {
        address,
        trustScore: trustScoreResult.score,
        sybilRisk: trustScoreResult.sybilRisk,
        humanProbability: trustScoreResult.humanProbability,
        recommendation: trustScoreResult.score >= 50 ? "APPROVE" : "REJECT",
        explanation: trustScoreResult.explainabilityText,
      };
    }));

    res.json({ results });
  } catch (error) {
    console.error("Enterprise API Error:", error);
    res.status(500).json({ error: "Internal server error during wallet analysis" });
  }
});
