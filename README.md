# 🌊 StreamMall

**Stream Digital Content, Earn Real-Time**  
The first decentralized marketplace for digital content with **streaming payments** powered by **Streamflow Protocol** on the **Umi Network**.  
Sellers earn per second. Buyers access content only while payments stream.

---

## 📌 Overview

StreamMall enables:
- 🎨 **Sellers** to upload digital content (courses, documents, games)
- 💸 **Buyers** to pay with **token streaming per second**
- 🧠 **Smart access control** — view content only when stream is active
- 🔐 Optional access NFTs during streaming sessions

---

## ⚙️ Tech Stack

| Layer        | Technology                        |
|--------------|------------------------------------|
| Frontend     | React, TailwindCSS                 |
| Backend      | Node.js (Express) or Next.js       |
| Blockchain   | Streamflow Protocol + Umi Network  |
| Wallet       | Umi Wallet SDK                     |
| Storage      | IPFS or mock file URLs             |
| Hosting      | Vercel (frontend), Railway/Render (backend) |

---

## 🧠 Architecture

[ React + Tailwind (Frontend) ]
↓
[ Express / Next.js API (Backend) ]
↓
[ Streamflow SDK + Umi Network ]
↓
[ IPFS or mock file storage ]


---

## 🗂 Folder Structure

StreamMall/
├── frontend/ # React + Tailwind App
│ ├── components/ # UI Elements (Nav, Cards, Wallet)
│ ├── pages/ # Home, Product, Dashboards
│ ├── hooks/ # useWallet, useStreamStatus
│ ├── utils/ # streamflow.ts, ipfs.ts
│ └── tailwind.config.js
│
├── backend/ # Node.js / Express or Next.js API
│ ├── routes/ # /products, /streams, /upload
│ ├── controllers/ # logic: upload, stream creation
│ ├── services/ # IPFS, Streamflow
│ └── index.js # App entry point
│
└── README.md # This file

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js `v18+`
- Git
- Chrome with [Umi Wallet Extension](https://chrome.google.com/webstore/detail/umi-wallet/)
- (Optional) Pinata or Web3.Storage for IPFS

---

### 📦 1. Clone and Install

```bash
git clone https://github.com/yourusername/streammall.git
cd streammall
🖼️ 2. Run Frontend
cd frontend
npm install
npm run dev
App runs at: http://localhost:3000

⚙️ 3. Run Backend
cd backend
npm install
npm run dev
Backend runs at: http://localhost:5000

👛 Umi Wallet Setup
Install Umi Wallet:
👉 Chrome Extension

Click "Connect Wallet" in the app

Use the Umi Devnet

⛓️ Streamflow SDK Integration
Install SDK:

npm install @streamflow/stream
Example – Creating a Stream
ts

import { createStream } from "@streamflow/stream";

const stream = await createStream({
  sender: buyerAddress,
  recipient: sellerAddress,
  tokenMint: "UMI_STREAM_TOKEN",
  rateAmount: pricePerSecond,
  startTime: Math.floor(Date.now() / 1000),
  ...
});
Full Docs: https://docs.streamflow.finance/

🔐 Access Control
Buyers can only access content if:

✅ A live Streamflow stream exists (buyer → seller)

✅ Price per second is sufficient

⛔️ Access revokes automatically if stream stops

🎟️ (Optional) Temporary NFT minted for access


# Common
UMI_RPC=https://rpc.testnet.umi.foundation
UMI_WALLET_MNEMONIC="test test test test test test test test test test test test"
STREAMFLOW_API=https://api.devnet.streamflow.finance
STREAM_TOKEN_MINT=UMITOKENADDRESS123
📊 Bonus Features (Coming Soon)
📈 Real-time revenue dashboard

🏆 Top seller leaderboard

📨 Email alerts when a stream ends (via SendGrid)

🎟️ Mint/revoke NFTs based on stream state

🔗 Useful Resources
🔗 Umi Network Docs

🔗 Streamflow SDK

🔗 Web3.Storage

🔗 Umi Wallet Extension

🙋 Author
Built by @rohitjadhav07
For the Umi Hackathon 2025

📜 License
MIT © 2025 StreamMall Team
