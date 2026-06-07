import express from "express";
import cors from "cors";
import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { analysisRouter } from "./routes/analysis.routes";
import { enterpriseRouter } from "./routes/enterprise.routes";
import { alertsRouter } from "./routes/alerts.routes";
import { copilotRouter } from "./routes/copilot.routes";
import { investigationRouter } from "./routes/investigation.routes";
import { analysisQueue } from "./queues/analysis.queue"; // to ensure the queue and worker initialize
import { requireAuth } from "./middleware/authMiddleware";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Better Auth endpoint
app.all("/api/auth/*catchall", toNodeHandler(auth));

// Sybil Analysis endpoint
app.use("/api/analysis", requireAuth, analysisRouter);

// Enterprise Phase 2 & 3 Endpoints
app.use("/api/alerts", requireAuth, alertsRouter);
app.use("/api/copilot", requireAuth, copilotRouter);
app.use("/api/investigations", requireAuth, investigationRouter);

// Enterprise API Endpoint (Phase 1)
app.use("/v1", requireAuth, enterpriseRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
