# 🚀 BitCentral MCP Server

A high-performance **Model Context Protocol (MCP)** server built in Go for **BitCentral**. It exposes real-time college data tools directly to AI chatbots, agents, and LLM assistants (ChatGPT, Claude, Cursor, and custom web chat interfaces).

---

## 🌟 Available MCP Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| **`get_student_reward_points`** | `query` *(required, roll no or name)* | Look up a student's reward points balance, redeemed points, cumulative points, mentor name, year, and department. |
| **`get_student_reward_history`** | `roll_no` *(required)*, `page`, `limit` | Detailed chronological activity log with dates, positive/negative points, and event descriptions. |
| **`get_reward_points_averages`** | *(none)* | Overall batch/year-wise average reward points across the institution (Year I, II, III, IV). |
| **`get_mess_menu`** | `hostel` *(boys/girls)*, `date` *(YYYY-MM-DD, optional)* | Today's or specific date's hostel mess menu with current meal window and full breakfast/lunch/dinner items. |
| **`get_mess_timings`** | *(none)* | Standard meal timing windows (Breakfast, Lunch, Dinner in IST). |
| **`search_faculty_directory`** | `query` *(optional)*, `department` *(optional)* | Search faculty phone numbers, email addresses, department, and designation. |
| **`get_student_exam_halls`** | `register_no` *(required)* | All scheduled exam sessions, course codes, hall numbers, dates, timings, and campus block names. |
| **`get_exam_hall_by_course`** | `register_no` *(required)*, `course_code` *(required)* | Specific exam hall number and block for a course code. |
| **`get_leave_details`** | `status` *(upcoming / past / all)* | College leaves and holidays, countdown of days remaining, and half-day (FN/AN) notices. |
| **`get_reward_points_leaderboard`** | `year` *(I, II, III, IV)*, `department` *(CSE, IT, ECE, etc.)* | Top 10 students leaderboard ranked by reward points balance. |
| **`get_sponsors_leaderboard`** | `type` *(individual / department)* | Top student contributors and department sponsor rankings. |

---

## 🛠️ Local Development & Testing

### 1. Run over HTTP / Server-Sent Events (SSE)
```bash
cd mcp-server
go run .
```
- **SSE Endpoint:** `http://localhost:8081/sse`
- **Message Endpoint:** `http://localhost:8081/message`
- **Health Check:** `http://localhost:8081/health`

### 2. Run over Standard I/O (Stdio) for Desktop Clients
```bash
go run . --stdio
```

---

## 🚢 Deploying to Render

### Method 1: Web Service using Docker (Recommended)
1. In your **Render Dashboard**, click **New +** ➡️ **Web Service**.
2. Connect your Git repository (`bitcentral-v2`).
3. Set the following settings:
   - **Root Directory:** `mcp-server`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `Dockerfile`
4. In **Environment Variables**, add:
   - `PORT`: `10000` (Render's default)
   - `BACKEND_URL`: Your deployed BitCentral backend URL (e.g. `https://bitcentral.bitsathy.in` or `https://bitcentral-server.onrender.com`)
   - `BACKEND_AUTH_TOKEN`: *(Optional, if backend requires token)*
5. Click **Create Web Service**.
6. Render will automatically build the Go binary and deploy the service.

### Method 2: Render Blueprint (`render.yaml`)
1. Click **New +** ➡️ **Blueprint**.
2. Select your repository. Render will automatically detect `mcp-server/render.yaml` and configure the service.

---

## 🤖 Connecting to AI Chatbots & Clients

### 1. Claude Desktop (`claude_desktop_config.json`)
Add to `%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "bitcentral": {
      "command": "e:/Projects/bitcentral-v2/mcp-server/mcp-server.exe",
      "args": ["--stdio"],
      "env": {
        "BACKEND_URL": "http://localhost:8080"
      }
    }
  }
}
```

Or when connecting over SSE to your deployed Render URL:
```json
{
  "mcpServers": {
    "bitcentral-remote": {
      "url": "https://your-bitcentral-mcp.onrender.com/sse"
    }
  }
}
```

### 2. Cursor IDE
In **Cursor Settings** ➡️ **Features** ➡️ **MCP Servers** ➡️ **Add New MCP Server**:
- **Name:** `BitCentral`
- **Type:** `sse`
- **URL:** `https://your-bitcentral-mcp.onrender.com/sse`

### 3. Custom Chatbot Frontend / Web Agents
Your web chatbot can connect to the MCP server's Server-Sent Events endpoint:
```javascript
const eventSource = new EventSource("https://your-bitcentral-mcp.onrender.com/sse");

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("MCP Event:", data);
};
```
To invoke tools, send JSON-RPC 2.0 POST requests to `https://your-bitcentral-mcp.onrender.com/message`.
