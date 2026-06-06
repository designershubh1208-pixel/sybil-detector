# Beacon: The Palantir of Web3 Wallet Trust

![Beacon Platform]
*Note: Replace with actual screenshot of your Intelligence Dashboard*

**Beacon** is an enterprise-grade Wallet Trust Intelligence Platform. It moves beyond simple binary blacklists to offer nuanced, machine-learning-driven behavioral analysis of Web3 wallets. By clustering transaction timings, smart contract overlaps, and protocol diversity, Beacon identifies malicious automated Sybil farms before they can drain rewards from DAOs, airdrops, and launchpads.

## 🌟 Core Features

- **Unsupervised Sybil Clustering (K-Means):** Automatically groups thousands of wallets into clusters based on identical on-chain behavioral footprints (execution timing, shared smart contracts, gas usage).
- **Universal Trust Score (0-100):** Every analyzed wallet receives a granular Trust Score and Sybil Risk percentage, allowing protocols to dynamically scale airdrop rewards rather than just blocking users.
- **Cross-Chain Entity Resolution:** When a Sybil cluster is detected, Beacon explicitly groups those wallets under a single unified "Operator Entity," mapping out the infrastructure of the attacker.
- **Governance Attack Detection:** Identifies coordinated voting behaviors to prevent manipulated DAO proposals.
- **AI Copilot (Powered by Gemini):** A global forensic AI assistant that can instantly answer natural language questions about your workspace's active threats and network metrics.
- **Live Alerts & Intelligence Workspace:** Real-time monitoring feed for high-risk network events, alongside a dedicated case-file workspace to track and tag specific forensic investigations.
- **Enterprise REST API:** A production-ready `/v1/wallet/check` endpoint for protocols to synchronously score wallet trust levels directly inside their dApp frontends.

---

## 🛠 Tech Stack

**Backend Engine**
- **Node.js / Express:** High-performance REST API.
- **Prisma & PostgreSQL:** Relational database for storing cross-chain relationships, Trust Scores, and Entities.
- **BullMQ & Redis:** Robust background queue system for processing heavy ML extractions and clustering without blocking the API.
- **Google Gemini 2.5 Flash:** Used to generate human-readable forensic reports and power the AI Copilot.

**Frontend Interface**
- **Next.js 14 (App Router):** Fast, React-based UI framework.
- **Tailwind CSS & Framer Motion:** Beautiful, fluid, responsive component styling and animations.
- **Lucide Icons:** Clean iconography for the intelligence dashboard.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or remote)
- Redis (running locally or remote)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/sybil-detector.git
cd sybil-detector

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
# Database & Queue
DATABASE_URL="postgresql://user:password@localhost:5432/sybil_detector"
REDIS_URL="redis://localhost:6379"
PORT=3001

# External APIs
ETHERSCAN_API_KEY="your_etherscan_api_key"
GEMINI_API_KEY="your_google_gemini_api_key"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your_random_secret_string"
```

### 3. Database Setup
```bash
cd backend
npx prisma db push
npx prisma generate
```

### 4. Run the Platform
Start the backend API and queue workers:
```bash
cd backend
npm run dev
```

Start the frontend dashboard:
```bash
cd frontend
npm run dev
```
Navigate to `http://localhost:3000` to access the Beacon Intelligence Platform.

---

## 🔌 Using the Enterprise API

Protocols can integrate Beacon directly to protect their dApps in real-time.

**Endpoint:** `POST /v1/wallet/check`
**Headers:** `x-api-key: your_api_key_here`
**Body:**
```json
{
  "wallets": ["0xabc...", "0xdef..."]
}
```
**Response:**
```json
{
  "success": true,
  "results": [
    {
      "wallet": "0xabc...",
      "trustScore": 85,
      "recommendation": "APPROVE",
      "riskFactors": ["None"]
    }
  ]
}
```

---

## 📄 License
This project is proprietary and currently intended for internal enterprise use. 

*Built for the future of Web3 security.*
