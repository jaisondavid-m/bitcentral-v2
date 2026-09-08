# 🚀 Deploying BitCentral MCP Server on VPS (with Google Gemini API)

This guide provides step-by-step instructions to deploy the **BitCentral MCP Server** on any Linux VPS (Ubuntu/Debian) powered by **Google Gemini API** (`gemini-2.0-flash`).

> [!NOTE]
> Because this setup uses Google Gemini API directly over HTTPS, **no heavy local AI models or Ollama are required**. The MCP server uses minimal CPU and RAM (~20-50 MB RAM), making it compatible with any low-cost VPS.

---

## 📋 Architecture & Ports

- **Server Port**: `8081` (Default)
- **AI Model Engine**: Google Gemini API (`gemini-2.0-flash` / `gemini-1.5-flash`)
- **Transport**: Server-Sent Events (SSE) + REST `/api/chat`
- **Endpoints**:
  - `http://<your-vps-ip>:8081/health` (Health Check)
  - `http://<your-vps-ip>:8081/api/chat` (AI Chat Assistant Endpoint)
  - `http://<your-vps-ip>:8081/sse` (MCP SSE Transport)

---

## 🛠️ Step 1: Build & Copy Binary to VPS

### On Local Machine or Build Server:
```bash
cd mcp-server

# Build static Linux binary
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o mcp-server .
```

### Transfer to VPS:
```bash
# Create directory on VPS
ssh root@<your-vps-ip> "mkdir -p /opt/bitcentral-mcp"

# Copy binary to VPS
scp mcp-server root@<your-vps-ip>:/opt/bitcentral-mcp/
```

---

## ⚙️ Step 2: Configure Systemd Service

On your VPS, create a systemd service file `/etc/systemd/system/bitcentral-mcp.service`:

```bash
sudo nano /etc/systemd/system/bitcentral-mcp.service
```

Paste the following configuration:

```ini
[Unit]
Description=BitCentral MCP Server (Google Gemini AI)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/bitcentral-mcp
ExecStart=/opt/bitcentral-mcp/mcp-server
Restart=always
RestartSec=5

# Environment Configuration
Environment=PORT=8081
Environment=GEMINI_API_KEY=your_gemini_api_key_here
Environment=GEMINI_MODEL=gemini-2.0-flash
Environment=BACKEND_URL=https://bitcentral.bitsathy.in
Environment=MCP_TRANSPORT=sse

# Logging
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

> [!SECURITY NOTE]
> Replace `your_gemini_api_key_here` with your actual Google Gemini API key.

---

## 🚀 Step 3: Start and Enable the Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable to start automatically on boot
sudo systemctl enable bitcentral-mcp

# Start the service
sudo systemctl start bitcentral-mcp

# Check status
sudo systemctl status bitcentral-mcp
```

### View Live Logs:
```bash
sudo journalctl -u bitcentral-mcp -f
```

---

## 🌐 Step 4: Configure Main Server (`server/`)

In your main BitCentral backend environment variables (or `.env` file), set:

```env
MCP_SERVER_URL=http://<your-vps-ip>:8081
# Or HTTPS domain if using Nginx domain:
# MCP_SERVER_URL=https://mcp-bitcentral.bitsathy.in
```

Restart your main backend server so `/api/chat` requests are proxied to your VPS MCP server.
