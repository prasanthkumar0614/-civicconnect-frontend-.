# CivicConnect — Citizen App

The citizen-facing web application for **CivicConnect**, an AI-powered civic issue reporting platform for Andhra Pradesh. Citizens report infrastructure problems (street lights, transformers, water pumps, roads, drainage, garbage bins) tied to a specific Asset ID, then track the complaint through to resolution.

## Live Service

- **Citizen app:** (your Vercel URL)
- **Backend API:** https://civicconnect-p3mq.onrender.com

## Features

- Cascading area picker: **District → Mandal → Village/Area → Ward → Asset**, backed by the backend's geographic hierarchy (28 districts, 683+ mandals, 16,000+ villages)
- Asset selection by stamped-ID-style Asset Tags (e.g. `SL-030`)
- Photo and video attachment on complaints
- Automatic acknowledgment message on submission
- Live status tracking with a full timeline, including department updates and resolution notes
- Mobile-first responsive design

## Important Note About Area Data

The area picker draws on the backend's real government-sourced District and Mandal data, and real Village names from the LGD (Local Government Directory, Government of India). **Ward-level entries are application-generated** (5 per village) for demonstration purposes and are not official government ward boundaries — see the backend README for details.

## Tech Stack

React + Vite, plain CSS with a custom civic design system (navy/teal palette, stamped-utility-tag visual identity).

## Local Setup

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in a `.env` file pointing at the backend API.

## Author

**Sodima Naga Prasanth Kumar**

B.Tech Electronics & Communication Engineering
Pace Institute of Technology and Sciences, Ongole

**Role:** Developer / Creator of CivicConnect
