# 🚀 Deploying BitCentral MCP Server on Render (with Google Gemini API)

This guide provides step-by-step instructions to deploy the **BitCentral MCP Server** to **Render** using **Google Gemini API** (`gemini-2.0-flash`).

---

## 📋 System Requirements & Architecture

- **Deployment Platform**: Render Web Services (Free / Paid plan)
- **AI Model Engine**: Google Gemini API (`gemini-2.0-flash` / `gemini-1.5-flash`)
- **Transport**: Server-Sent Events (SSE) + REST `/api/chat`
- **Endpoints**:
  - `https://<your-render-service>.onrender.com/health` (Health Check)
  - `https://<your-render-service>.onrender.com/api/chat` (AI Chat Assistant Endpoint)
  - `https://<your-render-service>.onrender.com/sse` (MCP SSE Transport)

---

## 🛠️ Step 1: Set Up Environment Variables on Render

In your **Render Dashboard** ➡️ **Web Service** ➡️ **Environment**:

1. Add `GEMINI_API_KEY`: Set to your Google Gemini API key.
2. Add `GEMINI_MODEL`: `gemini-2.0-flash` (Optional, defaults to `gemini-2.0-flash`).
3. Add `BACKEND_URL`: `https://bitcentral-v2.onrender.com` (or your main backend API URL).
4. Add `PORT`: `10000` (Render default).

> [!SECURITY NOTE]
> Never commit `GEMINI_API_KEY` to public repositories. Always configure `GEMINI_API_KEY` directly inside Render Environment Variables.

---

## ⚙️ Step 2: Configure Main Server (`server/`)

In your main backend server settings (or Render environment for main backend), configure `MCP_SERVER_URL`:

```env
MCP_SERVER_URL=https://<your-mcp-service>.onrender.com
```

The main backend server will automatically proxy all `/api/chat` calls from the React frontend to the deployed MCP server on Render.
