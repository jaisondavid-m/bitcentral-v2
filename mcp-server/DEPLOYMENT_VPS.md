# 🚀 Deploying BitCentral MCP Server + Ollama (Qwen2.5 1.5B) on VPS

This guide provides step-by-step instructions to set up **Ollama**, **Qwen2.5 1.5B**, and the **BitCentral MCP Server** on a **2 GB RAM / 16 GB Storage Ubuntu VPS**.

---

## 📋 System Requirements & Architecture

- **VPS Spec**: 2 GB RAM, 16 GB SSD/NVMe storage, Ubuntu 22.04 / 24.04 LTS.
- **Frontend (Vercel)**: `https://bitcentral.bitsathy.in`
- **Backend (Render)**: `https://bitcentral-v2.onrender.com`
- **VPS Endpoints**:
  - `http://<your-vps-ip>:8081/api/chat` (AI Chatbot with MCP tool execution)
  - `http://<your-vps-ip>:8081/sse` (Standard MCP SSE transport for Cursor / Claude Desktop)

---

## 🛠️ Step 1: Create a 2GB Swap File (Crucial for 2GB RAM Stability)

To prevent Out-Of-Memory (OOM) process kills when Ollama loads Qwen2.5 1.5B, create a 2 GB swap file on disk:

```bash
# 1. Create swap file
sudo fallocate -l 2G /swapfile

# 2. Set restrictive permissions
sudo chmod 600 /swapfile

# 3. Format as swap space
sudo mkswap /swapfile

# 4. Enable swap
sudo swapon /swapfile

# 5. Make permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 6. Verify swap is active
free -h
```

---

## 🦙 Step 2: Install Ollama & Pull Qwen2.5 1.5B Model

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull Qwen2.5 1.5B model (~986 MB download)
ollama pull qwen2.5:1.5b

# 3. Test model execution locally on VPS
ollama run qwen2.5:1.5b "Hello! What is 2 + 2?"
# Type '/bypass' or Ctrl+D to exit after testing.
```

### Optimize Ollama for 2GB RAM:
Edit the Ollama systemd configuration to restrict concurrency:

```bash
sudo systemctl edit ollama
```

Paste the following environment variables:
```ini
[Service]
Environment="OLLAMA_NUM_PARALLEL=1"
Environment="OLLAMA_MAX_LOADED_MODELS=1"
Environment="OLLAMA_KEEP_ALIVE=15m"
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Save and restart Ollama:
```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

---

## ⚙️ Step 3: Build & Deploy BitCentral MCP Server

### Option A: Build Binary directly on VPS

```bash
# 1. Install Go 1.21+ on VPS (if not installed)
sudo apt update && sudo apt install -y golang git

# 2. Clone repository & enter mcp-server directory
git clone https://github.com/jaisondavid-m/bitcentral-v2.git
cd bitcentral-v2/mcp-server

# 3. Build Go executable
go build -o mcp-server main.go
chmod +x mcp-server
```

---

## 🔄 Step 4: Configure Systemd Service for MCP Server

Create a systemd unit file to keep the MCP server running 24/7 with automatic restart:

```bash
sudo nano /etc/systemd/system/bitcentral-mcp.service
```

Paste the following content (replace `/root/bitcentral-v2/mcp-server` with your actual path):

```ini
[Unit]
Description=BitCentral MCP Server (Ollama + Qwen2.5 Bridge)
After=network.target ollama.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/bitcentral-v2/mcp-server
ExecStart=/root/bitcentral-v2/mcp-server/mcp-server
Restart=always
RestartSec=5
Environment=PORT=8081
Environment=OLLAMA_URL=http://localhost:11434
Environment=MODEL_NAME=qwen2.5:1.5b
Environment=BACKEND_URL=https://bitcentral-v2.onrender.com

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable bitcentral-mcp
sudo systemctl start bitcentral-mcp

# Check status
sudo systemctl status bitcentral-mcp
```

Test health endpoint on VPS:
```bash
curl http://localhost:8081/health
```

---

## 🌐 Step 5: Configure Render & Vercel Environment Variables

### In Render Dashboard (`https://bitcentral-v2.onrender.com` Web Service):
Add / update environment variable:
- `MCP_SERVER_URL` = `http://<YOUR-VPS-IP>:8081` *(or your custom domain `https://mcp.bitsathy.in` if Nginx SSL is setup)*

### In Vercel Dashboard (`https://bitcentral.bitsathy.in`):
Add / update environment variable:
- `VITE_API_BASE_URL` = `https://bitcentral-v2.onrender.com`

---

## 🔒 Optional: Setup Nginx Reverse Proxy with SSL (HTTPS)

If you want a secure HTTPS domain for your VPS MCP server (e.g. `https://mcp.bitsathy.in`):

```bash
# 1. Install Nginx & Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# 2. Configure Nginx site
sudo nano /etc/nginx/sites-available/bitcentral-mcp
```

Add configuration:
```nginx
server {
    server_name mcp.bitsathy.in;

    location / {
        proxy_pass http://127.0.0.1:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Disable buffering for SSE stream support
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
    }
}
```

Enable site & obtain SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/bitcentral-mcp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d mcp.bitsathy.in
```

---

## 🧪 Step 6: Verify End-to-End Chat Flow

1. Open your frontend at `https://bitcentral.bitsathy.in`.
2. Click the floating menu and select **BitBot AI (Qwen2.5) 🤖**.
3. Ask a question such as:
   - *"What is today's boys mess menu?"*
   - *"Check reward points balance for 7376231CS106"*
   - *"Find contact info for CSE department faculty"*
4. Qwen2.5 1.5B will execute the necessary MCP tool, query Render backend APIs, and answer your query in natural language!
