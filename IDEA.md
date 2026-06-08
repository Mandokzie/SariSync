# Your Project: Micro-Commerce for Sari-Sari Stores

## Idea
- **Track:** Financial Inclusion / B2B Commerce
- **One-liner:** A B2B procurement platform where sari-sari stores order bulk stock from regional suppliers using USDC.

## Problem
Sari-sari stores (small neighborhood shops) are limited to local, often expensive suppliers. They have no easy way to access wider catalogs or digital procurement tools.

## How it uses Stellar
- **B2B Rails:** Low-cost, instant USDC payments between store and supplier.
- **On-Chain Invoicing:** Transaction history acts as a verifiable record of procurement for credit-scoring.
- **Atomic Swaps:** Automated payment upon delivery confirmation (via multisig or Soroban).

## What works in the demo
- [ ] Connect store wallet (Freighter)
- [ ] Browse supplier catalog (Mock regional items)
- [ ] Create bulk order & pay USDC
- [ ] Track delivery status

## Setup / run
- Network: **testnet**
- `cd web && npm install && npm run dev`
