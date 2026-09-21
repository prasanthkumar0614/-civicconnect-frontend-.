# CivicConnect — Citizen App

The citizen-facing web app for **CivicConnect**. Report a problem with a public asset (street light, water pump, transformer, etc.) in a few taps, and track it through to resolution.

🔗 **Backend API:** https://civicconnect-p3mq.onrender.com

## Features

- Cascading area picker (District → Mandal → Village → Ward), backed by real government administrative data across the entire state
- Asset selection by real, stamped-ID-style Asset Tags (e.g. `SL-030`)
- Photo and video attachments
- Automatic acknowledgment on submission
- Live status tracking with a full timeline, including department updates and resolution notes
- Mobile-first design

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
B.Tech Electronics & Communication Engineering, Pace Institute of Technology and Sciences, Ongole
