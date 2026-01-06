# HyperLocal - Stablecoin Micro-Payment Solution

This project is a prototype for a local task matching platform that leverages **JPYC (Stablecoin)** to enable micro-payments and programmable escrow.

## Core Solution

1. **Micro-Payments**: Using Polygon network to minimize gas fees, enabling 100-500 JPYC rewards.
2. **Programmable Escrow**: Smart contract-based locking of funds to ensure trustless transactions between strangers.
3. **AI Intent Extraction**: (Planned) LLM-based parsing of natural language requests into structured task data.
4. **Spatial Indexing**: Real-time matching of users within a 500m radius.

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Web3**: ethers.js v6, Polygon Network, JPYC
- **Maps**: MapLibre GL JS, OpenStreetMap
- **Icons**: Lucide React

## Getting Started

1. Install dependencies: `npm install`
2. Set environment variables:
   - `NEXT_PUBLIC_JPYC_CONTRACT=0x6AE7Dfc73E0dDE900d309A9FfC03c8d8617d5274`
   - `NEXT_PUBLIC_POLYGON_RPC=https://polygon-rpc.com`
3. Run: `npm run dev`

## Deployment

Optimized for Vercel. Ensure environment variables are set in the dashboard.
